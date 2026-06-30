import React from "react";
import Particles from "react-tsparticles";

const ParticleBackground = () => {

    return (

        <Particles
            options={{
                background: {
                    color: {
                        value: "#050816",
                    },
                },

                fpsLimit: 120,

                particles: {
                    color: {
                        value: "#10B981",
                    },

                    links: {
                        color: "#10B981",
                        distance: 150,
                        enable: true,
                        opacity: 0.2,
                        width: 1,
                    },

                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 1,
                        straight: false,
                    },

                    number: {
                        density: {
                            enable: true,
                        },
                        value: 60,
                    },

                    opacity: {
                        value: 0.3,
                    },

                    shape: {
                        type: "circle",
                    },

                    size: {
                        value: { min: 1, max: 5 },
                    },
                },

                detectRetina: true,
            }}
        />
    );
};

export default ParticleBackground;