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

class ListadoTrayectosDispositivos
{
	const METHODGET = 'GET';
	const INICIO = 'Inicio';

	private $traccarService;
	private $entityManager;
	private $trayectosDisponibles;

    public function __construct(Traccar $traccarService, EntityManager $entityManager)
    {
		$this->traccarService = $traccarService;
		$this->entityManager = $entityManager;
    }

    /**
    * @Route(
    *     name="trayectosDispositivos",
    *     path="/traccar/listadoTrayectosDispositivos/{grupo}",
    *     methods={"GET"},
    *     defaults={"_api_item_operation_name"="trayectosDispositivos"}
    * )
    *
    * @return Asignacion
    */
    public function __invoke($grupo = null)
    {
		$this->obtenerTrayectos($grupo);
		$devices = $this->obtenerDevices();

		foreach ($devices as $device) {
			$deviceId = $device['id'];
			$trayectoDisp = $this->traccarService->requestWithUrlParams(self::METHODGET, 'api/geofences?deviceId='.$deviceId);
			if ($trayectoDisp) {

				foreach ($this->trayectosDisponibles as $trayectoDisponible) {
					if (empty($trayectoDisponible->dispositivos)) {
						$trayectoDisponible->dispositivos = array();
					}

					if (empty($trayectoDisponible->circles)) {
						$this->getCircles($trayectoDisponible);
					}

					if ($trayectoDisponible->id === $trayectoDisp[0]->id) {
						array_push($trayectoDisponible->dispositivos, $deviceId);
					}
				}

			}
		}
		return new JsonResponse($this->trayectosDisponibles, 200);
    }

	public function getCircles($trayectoDisponible){
		$trayectoDisponible->circles = array();
		$grupoCircles = $trayectoDisponible->attributes->grupo;
		$circles = $this->traccarService->requestWithUrlParams(self::METHODGET, 'api/geofences?groupId='.$grupoCircles);

		if($circles){
			sort($circles);
		}

		$trayectoDisponible->circles = $circles;
	}


	public function obtenerTrayectos($grupo){
		$this->trayectosDisponibles = $this->traccarService->requestWithUrlParams(self::METHODGET, 'api/geofences?groupId='.$grupo);
	}

	public function obtenerDevices() {
		return $this->traccarService->requestWithoutParams(self::METHODGET, 'api/devices');
	}
}
