<?php

namespace AppBundle\DataFixtures;

use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

use AppBundle\Entity\Users;

class LoadUserData extends Fixture implements ContainerAwareInterface
{
     /**
     * @var ContainerInterface
     */
    private $container;

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    public function load(ObjectManager $manager)
    {

        $user = array(
            array('soporte.desarrollo@durango.gob.mx','Soporte','Soporte','Soporte',null,true,true,false,false,'ROLE_SOPORTE','75800',0,false,null)
        );

        for($i=0;$i<sizeof($user); $i++) {
          
            $userAdmin = new Users();

            $userAdmin->setEmail($user[$i][0]);
            $userAdmin->setUsername($user[$i][1]);
            $userAdmin->setNombre($user[$i][2]);
            $userAdmin->setPrimerApellido($user[$i][3]);
            $userAdmin->setSegundoApellido($user[$i][4]);
            $userAdmin->setVerified($user[$i][5]);
            $userAdmin->setActive($user[$i][6]);
            $userAdmin->setRecovery($user[$i][7]);
            $userAdmin->setMustChangePassword($user[$i][8]);
            $userAdmin->setRol($user[$i][9]);
            $userAdmin->setTelefono($user[$i][10]);
            $userAdmin->setAttempts($user[$i][11]);
            $userAdmin->setLocked($user[$i][12]);
            $userAdmin->setLastLogin($user[$i][13]);


            $hash = md5(str_shuffle("abcdefghijklmnopqrstuvwxyz0123456789".uniqid()));
            $userAdmin->setHash($hash);

            $plainPassword = '12345678';
            $encoder = $this->container->get('security.password_encoder');
            $encoded = $encoder->encodePassword($userAdmin, $plainPassword);

            $userAdmin->setPassword($encoded);

            $manager->persist($userAdmin);
            $manager->flush();
        }

    }
}

?>
