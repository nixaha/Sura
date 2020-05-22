<?php

namespace AppBundle\Action\AppMovil\Mapa;

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

class TrayectosDisponibles
{
	const METHODGET = 'GET';
	const INICIO = 'Inicio';
	const RETORNO = 'Retorno';

	private $traccarService;
	private $entityManager;
	private $trayectosDisponibles;
	private $circlesIds;

    public function __construct(Traccar $traccarService, EntityManager $entityManager)
    {
		$this->traccarService = $traccarService;
		$this->entityManager = $entityManager;
    }

    /**
    * @Route(
    *     name="trayectos",
    *     path="/ciudadano/trayectos/{grupo}",
    *     methods={"GET"},
    *     defaults={"_api_item_operation_name"="trayectos"}
    * )
    *
    * @return Asignacion
    */
    public function __invoke($grupo = null)
    {
		$this->obtenerTrayectosDisponibles($grupo);
		$trayectosAMostrar = array();

		$asignaciones = $this->entityManager->getRepository('AppBundle:Asignacion')->findAll();
		foreach ($asignaciones as $asignacion) {
			$deviceId = $asignacion->getIdDispositivo();
			$chofer = array();
			$idChofer = $asignacion->getIdUnidad()->getChoferes()[0]->getId();
			array_push($chofer, $idChofer);
			array_push($chofer, $asignacion->getIdUnidad()->getChoferes()[0]->getNombre());
			array_push($chofer, $asignacion->getIdUnidad()->getChoferes()[0]->getPrimerApellido());
			array_push($chofer, $asignacion->getIdUnidad()->getChoferes()[0]->getSegundoApellido());

			$fotografia = $this->entityManager->getRepository('AppBundle:Fotografias')->findOneBy(array('chofer' => $idChofer, 'activo' => 1));
			array_push($chofer, $fotografia->getFotoBlob());
			array_push($chofer, $asignacion->getIdUnidad()->getNumeroUnidad());

			$trayectoDisp = $this->traccarService->requestWithUrlParams(self::METHODGET, 'api/geofences?deviceId='.$deviceId);
			if ($trayectoDisp) {
				$trayectoDisp = $this->clearTrayectoDisp($trayectoDisp);

				foreach ($this->trayectosDisponibles as $trayectoDisponible) {
					if ($trayectoDisponible->id === $trayectoDisp[0]->id) {
						
						$trayectoDisponible->horario = $asignacion->getIdUnidad()->getIdRuta()->getHorario()->getValor();
						
						if (empty($trayectoDisponible->dispositivos)) {
							$trayectoDisponible->dispositivos = array();
						}
						array_push($trayectoDisponible->dispositivos, $deviceId);
						
						if (empty($trayectoDisponible->chofer)) {
							$trayectoDisponible->chofer = array();
						}
						
						array_push($trayectoDisponible->chofer, $chofer);
						
						if (empty($trayectoDisponible->circles)) {
							$this->getCircles($trayectoDisponible);
						}
					}
				}

			}
		}

		foreach ($this->trayectosDisponibles as $trayecto) {
			if (!empty($trayecto->horario)) {
				array_push($trayectosAMostrar, $trayecto);

			}
		}
		return new JsonResponse($trayectosAMostrar, 200);
    }

	public function getCircles($trayectoDisponible){
		$trayectoDisponible->circles = array();
		$this->circlesIds = array();
		$grupoCircles = $trayectoDisponible->attributes->grupo;
		$circles = $this->traccarService->requestWithUrlParams(self::METHODGET, 'api/geofences?groupId='.$grupoCircles);

		if($circles){
			sort($circles);
		}
		array_push($trayectoDisponible->circles, $circles);
	}


	public function obtenerTrayectosDisponibles($grupo){
		$trayectos = $this->traccarService->requestWithUrlParams(self::METHODGET, 'api/geofences?groupId='.$grupo);
		$this->trayectosDisponibles = array();

		if ($trayectos) {
			foreach ($trayectos as $trayecto) {
				if ($trayecto->description !== 'false') {
					array_push($this->trayectosDisponibles, $trayecto);
				}
			}
		}
	}

	public function clearTrayectoDisp($trayectos)
	{
		$trayectoAMostrar = array();

		foreach($trayectos as $trayecto){
			if(empty($trayecto->attributes->tipo)){
				array_push($trayectoAMostrar, $trayecto);
			}
		}

		return $trayectoAMostrar;
	}
}
