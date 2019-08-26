import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

exports.newItinerarioNotification = functions.firestore
    .document('itinerarios/{eventoId}')
    .onCreate(async (event: any) => {
        const data = event.data();
        const eventoId = data.eventoId;
        const nombre = data.nombre;
        const horario = `${data.horaInicio} - ${data.horaFin}`;
        const lugar = data.lugar;

        const payload = {
            notification: {
                title: 'Nuevo itinerario',
                body: `${nombre}\nHorario: ${horario}\nLugar: ${lugar}`
            }
        }

        const auth = admin.auth();
        const users: any = [];
        const userEvts: any = [];

        const fdb = admin.database();

        await auth.listUsers().then(allusers => {
            allusers.users.forEach(user => {
                users.push(user.uid);
            });
            users.forEach((userId: any) => {
                fdb.ref('Users').child(userId).on("value", (snapshot: any) => {
                    const eventosRegistrados = snapshot.child("eventosRegistrados").val();
                    if (eventosRegistrados) {
                        const evt = eventosRegistrados.indexOf(eventoId);
                        if (evt !== -1) {
                            userEvts.push(userId);
                        }
                    }
                });
            });
        }).catch(error => console.log(error));

        const db = admin.firestore();
        const devicesRef = db.collection('devices');

        const devices = await devicesRef.get();

        const tokens: any = [];

        devices.forEach(result => {
            const inf = result.data();
            if (userEvts.indexOf(inf.userId) !== -1) {
                tokens.push(inf.token);
            }
        })

        if (tokens.length > 0){
            return admin.messaging().sendToDevice(tokens, payload);
        }else{
            return;
        }
    });