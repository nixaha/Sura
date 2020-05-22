<?php

namespace AppBundle\Action\Traccar;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\HttpFoundation\Request;
use \Doctrine\ORM\EntityManager;
use Symfony\Component\DependencyInjection\ContainerInterface as Container;
use AppBundle\ExternalAPI\Traccar;
use AppBundle\Entity\Asignacion;

class ListaDispositivosNoGeofence
{
	const METHODGET = 'GET';
    /**
    * @var TokenStorageInterface
    */
    private $tokenStorage;
    private $em;
	private $traccarService;

    public function __construct(EntityManager $em, TokenStorageInterface $tokenStorage, Traccar $traccarService)
    {
		$this->traccarService = $traccarService;
        $this->tokenStorage = $tokenStorage;
        $this->em = $em;
    }

    /**
    * @Route(
    *     name="devicesNotGeofence",
    *     path="/traccar/devicesNotGeofence",
    *     methods={"GET"},
    *     defaults={"_api_item_operation_name"="devicesNotGeofence"}
    * )
    *
    * @return Unidad
    */
    public function __invoke(Request $request)
    {
        $serializer = new Serializer();
		$this->devicesNoAsignadosAGeo = array();
		$devices = $this->devices();
		$geoId = $request->query->get('id');

		$this->filtrarDevicesNoGeo($devices, $geoId);

		return new JsonResponse($serializer->normalize($this->devicesNoAsignadosAGeo, 'json'), 200);
	}
	
	public function filtrarDevicesNoGeo($devices, $geoId)
	{
		foreach ($devices as $device) {
			$geo = $this->geofence($device['id']);
			if (count($geo) == 0) {
				array_push($this->devicesNoAsignadosAGeo, ['id'=>$device['id'],'name'=>$device['name'],'assigned'=>false]);
			} else {
				if(!empty($geoId)){
					foreach($geo as $g){
						if($g->id==$geoId){
							array_push($this->devicesNoAsignadosAGeo, ['id'=>$device['id'],'name'=>$device['name'],'assigned'=>true]);
						}
					}
				}
			}
		}
	}

	public function devices(){
		$devices = $this->traccarService->requestWithoutParams(self::METHODGET, 'api/devices');
		$enabledDevices = array();
		foreach($devices as $device){
			if(!$device['disabled']){
				array_push($enabledDevices,$device);
			}
		}
		return $enabledDevices;
	}

	public function geofence($deviceId){
		return $this->traccarService->requestWithUrlParams(self::METHODGET, 'api/geofences?deviceId='.$deviceId);
	}
}
?>
