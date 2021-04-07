import React, { useEffect, useState, useRef } from 'react';
import { Client, LocalStream, RemoteStream } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';

const baseUrl = "ws://localhost:7000/ws";
const CallScreen = () => {
    const [localStream, setLocalStream] = useState<LocalStream | null>();
    const [remoteStream, setRemoteStream] = useState<RemoteStream | null>();
    const remoteVideo = useRef<HTMLVideoElement>(null);
    const localVideo = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const signalLocal = new IonSFUJSONRPCSignal(baseUrl);
        const signalRemote = new IonSFUJSONRPCSignal(baseUrl);
        const clientLocal = new Client(signalLocal);
        const clientRemote = new Client(signalRemote);
        signalLocal.onopen = () => clientLocal.join("test session", "uuid1");

        const instantiateStream = async () => {
            // Get a local stream
            try {

                const local = await LocalStream.getUserMedia({
                    audio: true,
                    video: true,
                    simulcast: true, // enable simulcast
                    resolution: 'hd',
                    codec: 'vp8',
                });
                setLocalStream(local);
                clientLocal.publish(local);
                
                signalRemote.onopen = () => clientRemote.join("test session", "uuid2");
                // Setup handlers
                clientRemote.ontrack = (track: MediaStreamTrack, stream: RemoteStream) => {
                    console.log('remote client stream', stream);
                    setRemoteStream(stream);
                    if (track.kind === "video") {
                        // prefer a layer
                        stream.preferLayer('high');
                    }
                };
            } catch(err) {
                console.error(err);
            }
            // Publish stream
        }
        instantiateStream();
        return () => {
            // Close client connection
            // dc.close();
            clientLocal.close();
            clientRemote.close();
            signalRemote.close();
            signalLocal.close();
        }
    }, []);

    // const toggleLocalAudio = (mute: boolean) => {
    //     if (!localStream) {
    //         return
    //     }
    //     if (mute) {
    //         // mute local straem
    //         localStream.mute('audio')
    //         return
    //     }
    //     // unmute local stream
    //     localStream.unmute('audio')
    // }

    // const toggleLocalVideo = (mute: boolean) => {
    //     if (!localStream) {
    //         return
    //     }
    //     if (mute) {
    //         // mute local straem
    //         localStream.mute('video')
    //         return
    //     }
    //     // unmute local stream
    //     localStream.unmute('video')
    // }

    // const toggleRemoteAudio = (mute: boolean) => {
    //     if (!remoteStream) {
    //         return
    //     }
    //     if (mute) {
    //         // mute local straem
    //         remoteStream.mute('audio')
    //         return
    //     }
    //     // unmute local stream
    //     remoteStream.unmute('audio')
    // }

    // const toggleRemoteVideo = (mute: boolean) => {
    //     if (!remoteStream) {
    //         return
    //     }
    //     if (mute) {
    //         // mute local straem
    //         remoteStream.mute('video')
    //         return
    //     }
    //     // unmute local stream
    //     remoteStream.unmute('video')
    // }

    const onVideoMetadataLoaded = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        e.currentTarget.play();
        // onVideoConnected();
    };
    useEffect(() => {
        if (localVideo && localStream) {
            //@ts-ignore
            localVideo!.current.srcObject = localStream;
        }
    }, [ localStream ]);
    useEffect(() => {
        if (remoteVideo && remoteStream) {
            //@ts-ignore
            remoteVideo!.current.srcObject = remoteStream;
        }
    }, [ remoteStream ]);

    return (
        <>
            <div className="absolute w-24 right-0 mt-4 mr-4">
                <video ref={localVideo} className="rounded" muted playsInline autoPlay/>
            </div>
            <video
                ref={remoteVideo}
                onLoadedMetadata={onVideoMetadataLoaded}
                playsInline
                className={[
                    `w-full h-full rounded`,
                ].join('')}
            />
        </>
    );
}

export default CallScreen;

