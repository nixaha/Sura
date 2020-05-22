<?php

namespace AppBundle\Action\Traccar;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Normalizer\CarbonNormalizer;
use Carbon\Carbon;
use Symfony\Component\DependencyInjection\ContainerInterface as Container;
use \Doctrine\ORM\EntityManager;

use AppBundle\ExternalAPI\Traccar;

use AppBundle\Entity\Users;

class EnviarNotificaciones
{
	const ASIGNACIONENTITY = 'AppBundle:Asignacion';
	const UNIDADENTITY = 'AppBundle:Unidad';
	const RUTAENTITY = 'AppBundle:Ruta';
	const METHODGET = 'GET';
	const EXIT_TYPE = 'geofenceExit';
	const STOP_TYPE = 'deviceStopped';

    private $container;
	private $em;
	private $traccar;
	private $sending;

    public function __construct(Container $container, EntityManager $em, Traccar $traccar)
    {
        $this->container = $container;
		$this->em = $em;
		$this->traccar = $traccar;
		$this->sending = false;
    }

    /**
    * @Route(
    *     name="enviar_notificacion",
    *     path="traccar/enviar-notificacion",
    *     methods={"POST"},
    *     defaults={"enviar_notificacion"}
    * )
    *
    * @return User
    */
    public function __invoke(Request $request)
    {

		$deviceId = $request->request->get('deviceId');
		$geofenceId = $request->request->get('geofenceId');
		$asignacion = $this->em->getRepository(self::ASIGNACIONENTITY)->findBy(array(
			'idDispositivo' => $deviceId
		  ));
		$hora = $this->convertirHora($request->request->get('hora'));

		if($asignacion){
			$user = $request->request->get('user');
			$email = $request->request->get('email');
			$type = $request->request->get('type');
			$unidad = $this->em->getRepository(self::UNIDADENTITY)->findOneBy(['id' => $asignacion[0]->getIdUnidad()]);
			$horarioRuta = $this->em->getRepository(self::RUTAENTITY)->getHorario($unidad->getIdRuta()->getId())[0]['valor'];
		    $chofer = $unidad->getChoferes()[0];
		    $link = $this->getLatlngLink($request->request->get('positionId'));
		    $numeroUnidad = $unidad->getNumeroUnidad();
			$nombreChofer = $chofer->getNombre().' '.$chofer->getPrimerApellido().' '.$chofer->getSegundoApellido();
			if($this->horarioServicio($hora,$horarioRuta)){
				if($type === self::EXIT_TYPE && !$this->sending){
					$geofenceValido = $this->geofenceValido($deviceId,$geofenceId);
					if($geofenceValido){
						$this->sending = true;
						$this->enviarMail($user,$hora,$link,$numeroUnidad,$nombreChofer,$email,$type);
					}
				}else if($type === self::STOP_TYPE && !$this->sending){
					$this->sending = true;
					$this->enviarMail($user,$hora,$link,$numeroUnidad,$nombreChofer,$email,$type);
				}
			}
		}
		$serializer = new Serializer();
		return new JsonResponse($serializer->normalize(['status'=>'ok'], 'json'), 200);
	}
	
	public function enviarMail($user,$hora,$link,$numeroUnidad,$nombreChofer,$email,$type){
		$message = \Swift_Message::newInstance();
		$images['ged-line'] = $message->embed(\Swift_Image::fromPath('webroot/images/mail/ged-line.jpg'));
		$images['logo'] = $message->embed(\Swift_Image::fromPath('webroot/images/mail/logo.png'));
		$images['recovery_password'] = $message->embed(\Swift_Image::fromPath('webroot/images/mail/password.png'));
		$images['shadow'] = $message->embed(\Swift_Image::fromPath('webroot/images/mail/shadow.png'));
        $images['envelope'] = $message->embed(\Swift_Image::fromPath('webroot/images/mail/envelope.png'));
		$message->setSubject('Notificación')
		->setFrom([$this->container->getParameter('mailer_sender_address') => $this->container->getParameter('app.name')])
		->setTo($email)
		->setBody(
			$this->container->get('templating')->render('emails/traccar/notificacion.html.twig',
			compact('user','hora','link','numeroUnidad','nombreChofer','type','images','path')),
            'text/html'
		);
		if($this->container->get('mailer')->send($message)){
			$this->sending = false;
		}
	}

	public function convertirHora($hora){
		$fechaNow = Carbon::now();
		$date = Carbon::parse($hora);
		
		$offset = abs($fechaNow->getOffset() / 3600);
		$date->subHours($offset);

		return $date->hour.':'.$date->minute;
	}

	public function getLatlngLink($positionId){
		$url = $this->container->getParameter('app.monitoreo.url');
		$data = $this->traccar->requestWithoutParams(self::METHODGET, 'api/positions?id='.$positionId)[0];
		return $url.$data['deviceId'].'/'.$data['latitude'].'/'.$data['longitude'];
	}

	public function horarioServicio($hora,$horarioRuta){
		$horarioRuta = str_replace(" ", "", $horarioRuta);
		$posScore = strpos($horarioRuta, '-');
		$hora = Carbon::parse($hora);
		$horaInicio = Carbon::parse(substr($horarioRuta, 0, $posScore));
		$horaFin = Carbon::parse(substr($horarioRuta, $posScore + 1, strlen($horarioRuta)));
		$valido = false;

		if($hora >= $horaInicio && $hora <= $horaFin){
			$valido = true;
		}

		return $valido;
	}

	public function geofenceValido($deviceId,$geofenceId){
		$valido = false;
		$data = $this->traccar->requestWithoutParams(self::METHODGET, 'api/geofences?deviceId='.$deviceId);
		for($i = 0; $i < count($data); $i++){
			if($data[$i]['id'] == $geofenceId && empty($data[$i]['attributes']['tipo'])){
				return true;
			}
		}
		return $valido;
	}
}
?>
