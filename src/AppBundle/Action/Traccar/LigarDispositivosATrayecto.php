<?php

namespace AppBundle\Action\Traccar;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\DependencyInjection\ContainerInterface as Container;
use AppBundle\ExternalAPI\Traccar;
use AppBundle\Action\Traccar\ActivarInactivarTrayecto;

class LigarDispositivosATrayecto
{
	const METHODGET = 'GET';
	const METHODDELETE = 'DELETE';
	const METHODPOST = 'POST';

	private $container;
	private $traccarService;

	private $newLinkedDevices;
	private $trayecto;

    public function __construct(Container $container, Traccar $traccarService, ActivarInactivarTrayecto $trayecto)
    {
		$this->traccarService = $traccarService;
		$this->container = $container;
		$this->newLinkedDevices = array();
		$this->trayecto = $trayecto;
    }

    /**
    * @Route(
    *     name="linkDevices",
    *     path="/traccar/linkDevices",
    *     methods={"POST"},
    *     defaults={"_api_item_operation_name"="linkDevices"}
    * )
    *
    * @return Unidad
    */
    public function __invoke(Request $request)
    {
        $serializer = new Serializer();
		$geofenceId = $request->request->get('geofenceId');
		$devices = $request->request->get('devices');
		$linkedDevices = $this->getLinkedDevices($geofenceId);
		if(!empty($linkedDevices)){
			$this->clearDevices($linkedDevices,$geofenceId);
		}
		$statusAsignaciones = array();
		foreach($devices as $device){
			array_push($this->newLinkedDevices,$device['id']);
			$status = $this->linkDevice($geofenceId,$device['id']);
			array_push($statusAsignaciones,['deviceName'=>$device['name'],'status'=>$status]);
		}
		$this->checkNewLinkedDevices($linkedDevices);
		return new JsonResponse($serializer->normalize($this->getMessage($statusAsignaciones), 'json'), $this->code);
	}

	public function getLinkedDevices($id){
		$linkedDevices = array();
		$response = $this->traccarService->requestWithoutParams(self::METHODGET, 'api/devices');
		if(!empty($response)){
			foreach($response as $device){
				$responseGeofence = $this->traccarService->requestWithUrlParams(self::METHODGET, 'api/geofences?deviceId='.$device['id']);
				if(!empty($responseGeofence)){
					foreach($responseGeofence as $geofence){
						if($geofence->id==$id){
							array_push($linkedDevices,$device['id']);
						}
					}
				}
			}
		}
		return $linkedDevices;
	}

	public function linkDevice($geofenceId,$deviceId){
		$disabled = $this->isDisabledDevice($deviceId);
		if($disabled){
			return 409;
		}
		$body = ['deviceId'=>$deviceId,'geofenceId'=>$geofenceId];
		return $this->traccarService->requestReturnStatusCode(self::METHODPOST, 'api/permissions', $body);
	}

	public function isDisabledDevice($deviceId){
		return $this->traccarService->requestWithUrlParams(self::METHODGET, 'api/devices?id='.$deviceId)[0]->disabled;
	}

	public function clearDevices($linkedDevices,$geofenceId){
		foreach($linkedDevices as $device){
			$body = ['deviceId'=>$device,'geofenceId'=>$geofenceId];
			$this->traccarService->requestNoReturn(self::METHODDELETE, 'api/permissions', $body);
		}
	}

	public function checkNewLinkedDevices($linkedDevices){
		foreach($linkedDevices as $device){
			if(!in_array($device,$this->newLinkedDevices)){
				$this->trayecto->desasignarUnidDisp($device);
			}
		}
	}

	public function getMessage($asignaciones){
		$msg;
		$error = false;
		$this->code = 200;
		$i = 0;
		krsort($asignaciones,SORT_NUMERIC);
		forEach($asignaciones as $asignacion){
			if($asignacion['status']!=204){
				if(!$error){
					$error = true;
					$msg = "Hubo un error al asignar los siguientes dispositivos: ";
					$this->code = 409;
				}
				$msg = $msg.$asignacion['deviceName'].(($i==count($asignaciones)-1)?'':', ');
			}
			$i++;
		}
		if(!$error){
			$msg = "Los dispositivos fueron asignados y/o desasignados correctamente";
		}
		return ['body'=>$msg];
	}
}
?>
