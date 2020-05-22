<?php

namespace AppBundle\DataFixtures;

use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use AppBundle\Entity\ParametroConfigurable;
class LoadParametrosConfigurables extends Fixture implements ContainerAwareInterface
{
     /**
     * @var ContainerInterface
     */
    private $container;

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    public function load(ObjectManager $manager){
    	
 		$arrayParametro = array(
 			array("HORARIO","8:00 - 15:00",true,"HORARIO"),

		  );

		for($i=0;$i<sizeof($arrayParametro); $i++) {
			$parametro = new ParametroConfigurable();
			$parametro->setParametro( $arrayParametro[$i][0] );
			$parametro->setValor( $arrayParametro[$i][1]);
			$parametro->setActivo($arrayParametro[$i][2]);
            $parametro->setTipo($arrayParametro[$i][3]);
			$manager->persist($parametro);
        	$manager->flush();
		}
    }
}