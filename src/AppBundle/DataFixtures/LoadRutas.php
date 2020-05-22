<?php

namespace AppBundle\DataFixtures;

use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use AppBundle\Entity\Ruta;
use Doctrine\ORM\EntityManagerInterface;
class LoadRutas extends Fixture implements ContainerAwareInterface
{
     /**
     * @var ContainerInterface
     */
    private $container;

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    public function load(ObjectManager $manager ){
    	$municipio = $manager->getRepository('\AppBundle\Entity\Municipio')->findBy(array('nombreMunicipio' => 'Durango'))[0];
    	$horario = $manager->getRepository('AppBundle\Entity\ParametroConfigurable')->findBy(array('parametro'=>'HORARIO'))[0];
    	$arrayRuta = array(
            array($municipio,"Ruta 1 CREE - Fracc. San Marcos",$horario,true,true),
    		array($municipio,"Ruta 2 CREE - Fracc. Huizache", $horario,true,true),
    		array($municipio,"Ruta 3 CREE - Villas del Guadiana", $horario,false,true),
    		array($municipio,"Ruta 4 CREE - Fracc. La Ferrería", $horario,true,true),
    		array($municipio,"Ruta 5 CREE - El Nayar", $horario,true,true),
    		array($municipio,"Ruta 6 CAM Huizache - Carril 2000 - CAM Joyas",$horario,false,true),

		  );

		for($i=0;$i<sizeof($arrayRuta); $i++) {
			$ruta = new Ruta();
			$ruta->setCiudad($arrayRuta[$i][0]);
			$ruta->setNombreRuta($arrayRuta[$i][1]);
			$ruta->setHorario($arrayRuta[$i][2]);
			$ruta->setActivo($arrayRuta[$i][3]);
			$ruta->setAsignada($arrayRuta[$i][4]);
			$manager->persist($ruta);
        	$manager->flush();
		}



    }
}