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
use AppBundle\ExternalAPI\Traccar;
use \Doctrine\ORM\EntityManager;
use AppBundle\Entity\Asignacion;

class ListadoTrayectos
{
	const deviceId = 'deviceId';
	const geofenceId = 'geofenceId';
	const METHODGET = 'GET';

	private $em;
	private $traccarService;

    public function __construct(EntityManager $em, Traccar $traccarService)
    {
		$this->traccarService = $traccarService;
		$this->em = $em;
    }

    /**
    * @Route(
    *     name="listadoTrayectos",
    *     path="/traccar/listadoTrayectos",
    *     methods={"GET"},
    *     defaults={"_api_item_operation_name"="listadoTrayectos"}
    * )
    *
    * @return Asignacion
    */
    public function __invoke()
    {
		$normalizers = new ObjectNormalizer();
		$normalizers->setCircularReferenceLimit(1);
        $normalizers->setCircularReferenceHandler(function($object) {return $object->getId(); });
        $serializer = new Serializer([new CarbonNormalizer('Y-m-d'), $normalizers]);

		$asignaciones = $this->em->getRepository('AppBundle:Asignacion')->findAll();
		$trayectos = $this->obtenerTrayectos();
		$trayectosCompletos = array();
		$trayectosConDevices = array();
		if (!empty($asignaciones)) {
			$asignacionesIds = array();
			foreach ($asignaciones as $asignacion) {
				$asignacionDT = $this->deviceTrayecto($asignacion->getIdDispositivo());

				if (!in_array($asignacionDT[self::geofenceId], $asignacionesIds)) {
					array_push($asignacionesIds, $asignacionDT[self::geofenceId]);
					$trayectosConDevices[$asignacionDT[self::geofenceId]] = array();
					array_push($trayectosConDevices[$asignacionDT[self::geofenceId]], $asignacionDT[self::deviceId]);
				}
				else{
					array_push($trayectosConDevices[$asignacionDT[self::geofenceId]], $asignacionDT[self::deviceId]);
				}
			}

			foreach ($trayectos as $trayecto) {
				if(empty($trayecto['attributes']['tipo'])){
					$keySearch = array_search($trayecto['id'], $asignacionesIds);
					$trayecto['circles'] = $this->getCircles($trayecto['attributes']['grupo']);
					if(is_int($keySearch)){
						$trayecto['dispositivos'] = $trayectosConDevices[$trayecto['id']];
						$trayecto['unidad'] = $asignaciones[$keySearch]->getIdUnidad()->getNumeroUnidad();
						$trayecto['ruta'] = $asignaciones[$keySearch]->getIdUnidad()->getIdRuta()->getNombreRuta();
						$trayecto['ciudad'] = $asignaciones[$keySearch]->getIdUnidad()->getIdRuta()->getCiudad()->getNombreCabecera();
					}

					array_push($trayectosCompletos, $trayecto);
				}
			}
		}
		else{
			foreach ($trayectos as $trayecto) {
				if(empty($trayecto['attributes']['tipo'])){
					array_push($trayectosCompletos, $trayecto);
				}
			}
		}
		return new JsonResponse($serializer->normalize($trayectosCompletos, 'json'), 200);
    }

	public function getCircles($grupo){
		$circlesAsociados = array();
		if ($grupo != 0) {
			$circles = $this->traccarService->requestWithUrlParams(self::METHODGET, 'api/geofences?groupId='.$grupo);
			if($circles){
				foreach ($circles as $circle) {
					array_push($circlesAsociados, $circle->id);
				}
				sort($circlesAsociados);
			}
		}

		return $circlesAsociados;
	}

	public function deviceTrayecto($idDevice)
	{
		return $this->traccarService->deviceTrayecto(self::METHODGET, 'api/geofences?deviceId=', $idDevice);
	}

	public function obtenerTrayectos()
	{
        return $this->traccarService->requestWithoutParams(self::METHODGET, 'api/geofences');
	}
}
