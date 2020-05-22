<?php

namespace AppBundle\Action\Traccar;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\DependencyInjection\ContainerInterface as Container;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use AppBundle\Normalizer\CarbonNormalizer;
use \Doctrine\ORM\EntityManager;
use AppBundle\Entity\Asignacion;
use AppBundle\ExternalAPI\Traccar;

class CreacionPuntosDeControl
{
	const METHODPOST = 'POST';
	const METHODGET = 'GET';
	const RADIOCHECKPOINT = 200;
	const GEOFENCEIDPARAMETER = 'geofenceId';
	const APIPERMISSIONS = 'api/permissions';

	private $em;
	private $traccarService;

    public function __construct(EntityManager $em, Traccar $traccarService)
    {
		$this->traccarService = $traccarService;
		$this->em = $em;
    }

    /**
    * @Route(
    *     name="creacionPuntosDeControl",
    *     path="/traccar/creacionPuntosDeControl",
    *     methods={"POST"},
    *     defaults={"_api_item_operation_name"="creacionPuntosDeControl"}
    * )
    *
    * @return Asignacion
    */
    public function __invoke(Request $request)
    {
		$serializer = new Serializer();
		$circles = $request->request->get('circulos');
		$trayectoNombre = $request->request->get('trayectoNombre');
		$grupo = $request->request->get('grupo');
		$dispositivos = $request->request->get('dispositivos');
		$users = $this->usuarioCiudadanoTraccar();

		foreach ($users as $user) {
			if(!$user['administrator']){
				$userId = $user['id'];
				break;
			}
		}
		
		foreach($circles as $key => $circle){
			$geofenceCreado = json_decode($this->crearCircle($circle, $trayectoNombre, $key + 1));
			$idCirculo = $geofenceCreado->id;
			$this->ligarCirculoGrupo($idCirculo, $grupo);
			$this->ligarCirculoDispositivos($idCirculo, $dispositivos);
			$this->ligarCirculosUsuario($userId, $idCirculo);
		}
		
		return new JsonResponse($serializer->normalize(['success'=> "Puntos de control creados"], 'json'), 200);
    }

	public function crearCircle($circle, $trayectoNombre, $i)
	{
		$geofenceCircle = "CIRCLE (".$circle[0]." ".$circle[1].", ".self::RADIOCHECKPOINT.")";

		$circleObject = [
			"id" => 0,
            "name" => $trayectoNombre." ".$i,
            "description" => 'false',
            "area" => $geofenceCircle,
            "calendarId" => 0,
            "attributes" => [
                "tipo" => "circulo",
                "checkpointIndex" => $i
            ]
		];

		return $this->traccarService->requestWithBodyParams(self::METHODPOST, 'api/geofences', $circleObject);
	}

	public function ligarCirculoGrupo($idCirculo, $idGrupo)
	{
		$body = ['groupId'=>$idGrupo, self::GEOFENCEIDPARAMETER=>$idCirculo];
		return $this->traccarService->requestReturnStatusCode(self::METHODPOST, self::APIPERMISSIONS, $body);
	}

	public function ligarCirculoDispositivos($idCirculo, $dispositivos)
	{
		foreach($dispositivos as $dispositivo){
			$body = ['deviceId'=>$dispositivo, self::GEOFENCEIDPARAMETER=>$idCirculo];
			$this->traccarService->requestReturnStatusCode(self::METHODPOST, self::APIPERMISSIONS, $body);
		}
	}

	public function usuarioCiudadanoTraccar()
	{
		return $this->traccarService->requestWithoutParams(self::METHODGET, 'api/users');
	}

	public function ligarCirculosUsuario($userId, $idCirculo)
	{
		$body = ['userId'=>$userId, self::GEOFENCEIDPARAMETER=>$idCirculo];
		return $this->traccarService->requestReturnStatusCode(self::METHODPOST, self::APIPERMISSIONS, $body);
	}
}
?>