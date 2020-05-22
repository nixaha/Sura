<?php

namespace AppBundle\Action\AppMovil\Mapa;

use AppBundle\ExternalAPI\Traccar;
use Carbon\Carbon;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use \Doctrine\ORM\EntityManager;

class ReportEventDevice
{
    const METHODGET = 'GET';
    const EXIT = 'geofenceExit';
    const ENTER = 'geofenceEnter';
    const IDA = 'IDA';
    const VUELTA = 'VUELTA';
    const NODIRECCION = 'NODIRECCION';
    const MUESTRA = 2;

    private $traccarService;
    private $entityManager;
    private $allReports;

    public function __construct(Traccar $traccarService, EntityManager $entityManager)
    {
        $this->traccarService = $traccarService;
        $this->entityManager = $entityManager;
    }

    /**
     * @Route(
     *     name="reportesDevice",
     *     path="/ciudadano/reportesDevice/{device}/{grupoId}",
     *     methods={"GET"},
     *     defaults={"_api_item_operation_name"="reportesDevice"}
     * )
     *
     * @return Asignacion
     */
    public function __invoke($device = null, $grupoId = null)
    {
        $circulosAsociados = $this->gruposCirculos($grupoId);

				$fechaNow = Carbon::now();
				$offset = abs($fechaNow->getOffset() / 3600);
				$fechaNow->addHours($offset);

        $fechaInicio = Carbon::create($fechaNow->year, $fechaNow->month, $fechaNow->day, $fechaNow->hour - 1, $fechaNow->minute, 0);
        $fechaFin = Carbon::create($fechaNow->year, $fechaNow->month, $fechaNow->day, $fechaNow->hour, $fechaNow->minute, 59);

        $from = Carbon::createFromFormat('Y-m-d H:i:s', $fechaInicio->toDateTimeString())->format('Y-m-d\TH:i:s');
        $to = Carbon::createFromFormat('Y-m-d H:i:s', $fechaFin->toDateTimeString())->format('Y-m-d\TH:i:s');

				$this->allReports = $this->getReportsDevice($device, $from, $to);

        $eventsEnterExit = array();

        $eventsEnterExit = $this->filtrarEventos($circulosAsociados, $eventsEnterExit);

        $totalEvents = count($eventsEnterExit);

        if ($totalEvents > self::MUESTRA) {
            $eventsEnterExit = array_slice($eventsEnterExit, $totalEvents - self::MUESTRA, self::MUESTRA);
        }
        $direccion = self::NODIRECCION;

        $ultimoStatusDevice = $this->obtenerDeviceStatus($device)[0];

        if (count($eventsEnterExit) > 0) {
            $ultimoEventoGeofenceId = $eventsEnterExit[count($eventsEnterExit) - 1]->id;
            $index = array_search($ultimoEventoGeofenceId, array_column($circulosAsociados, 'id')) + 1;
            if ($index == 1) {
                $direccion = self::IDA;
            } else if ($index == count($circulosAsociados)) {
                $direccion = self::VUELTA;
            } else {
                $direccion = $this->obtenerDireccion($eventsEnterExit);
            }
        }

        return new JsonResponse(['direccion' => $direccion, 'status' => $ultimoStatusDevice->status], 200);
    }

    public function filtrarEventos($circulosAsociados, $eventsEnterExit)
    {
        foreach ($this->allReports as $report) {
            if ($report->type == self::ENTER) {
                foreach ($circulosAsociados as $circulo) {
                    if ($circulo->id === $report->geofenceId) {
                        array_push($eventsEnterExit, $circulo);
                    }
                }
            }
        }
        return $eventsEnterExit;
    }

    public function obtenerDireccion($eventsEnterExit)
    {
        $primerCheck = $eventsEnterExit[0];
        $totalASC = 0;
        $totalDESC = 0;
        for ($i = 1; $i < count($eventsEnterExit); $i++) {
            if ($eventsEnterExit[$i] > $primerCheck) {
                $totalASC++;
            } else if ($eventsEnterExit[$i] < $primerCheck) {
                $totalDESC++;
            }
        }
        if ($totalASC > $totalDESC) {
            return self::IDA;
        } else if ($totalASC < $totalDESC) {
            return self::VUELTA;
        } else {
            return self::NODIRECCION;
        }
    }

    public function obtenerDeviceStatus($device)
    {
        return $this->traccarService->requestWithUrlParams(self::METHODGET, 'api/devices?id=' . $device);
    }

    public function getReportsDevice($deviceId, $from, $to)
    {
        return $this->traccarService->requestWithUrlParams(self::METHODGET, 'api/reports/events?deviceId=' . $deviceId . '&from=' . $from . '&to=' . $to);
    }

    public function gruposCirculos($grupoId)
    {
        return $this->traccarService->requestWithUrlParams(self::METHODGET, 'api/geofences?groupId=' . $grupoId);
    }

}
