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

class RemoveCircles
{
	const METHODDELETE = 'DELETE';

	private $container;
	private $traccarService;

    public function __construct(Container $container, Traccar $traccarService)
    {
		$this->traccarService = $traccarService;
		$this->container = $container;
    }

    /**
    * @Route(
    *     name="removerPuntosDeControl",
    *     path="/traccar/removerPuntosDeControl",
    *     methods={"POST"},
    *     defaults={"_api_item_operation_name"="removerPuntosDeControl"}
    * )
    *
    * @return Unidad
    */
    public function __invoke(Request $request)
    {
        $serializer = new Serializer();
        $circles = $request->request->get("circulos");

		foreach($circles as $circle){
            $this->borrarCircle($circle["id"]);
        }
		return new JsonResponse($serializer->normalize(['success'=> "Puntos de control borrados"], 'json'), 200);
	}

	public function borrarCircle($idCircles){
        $this->traccarService->requestWithoutParams(self::METHODDELETE, 'api/geofences/'.$idCircles);
	}
}
?>
