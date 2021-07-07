import React from "react";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import AboutUsPerson from "../components/AboutUsPerson";

class AboutUsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            developers: this.shuffleArray([
                {
                    name: 'Diego Attardo',
                    github: 'Diego1304',
                },
                {
                    name: 'Lorenzo Colleoni',
                    github: 'ColleoniLorenzo',
                },
                {
                    name: 'Francesco Giacomo Brignoli',
                    github: 'xFranciB',
                },
                {
                    name: 'Alessio Crotti',
                    github: 'alekappa47',
                },
                {
                    name: 'Marco Biasion',
                    github: 'MarcusTral',
                },
                {
                    name: 'Luca Brugnetti',
                    github: '<username>',
                },
                {
                    name: 'Davide Cardillo',
                    github: 'davixlive',
                },
                {
                    name: 'Riccardo Facoetti',
                    github: 'RiccardoFacoetti',
                },
                {
                    name: 'Cristian Livella',
                    github: 'cristianlivella',
                },
                {
                    name: 'Gabriele Maggi',
                    github: 'gabrielemaggi',
                },
                {
                    name: 'Federico Mendiola',
                    github: 'FedericoMendiola',
                },
                {
                    name: 'Adriano Rampoldi',
                    github: 'adrianorampoldi'
                },
                {
                    name: 'Alessandro Verdi',
                    github: 'alessandroverdi',
                },
            ])
        }
    }

    shuffleArray = (array) => {
        let i = array.length - 1;
        for (; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    render() {
        return (
            <>
                <Typography variant="h5" style={{textAlign: 'center', marginTop: '10px'}}>
                    About us
                </Typography>
                <Paper style={{margin: '10px auto', padding: '15px', maxWidth: '1000px', textAlign: 'center'}}>
                    <Typography variant="subtitle1" gutterBottom>
                        <img src="https://i.imgur.com/jMTzBKa.png" alt="logo" style={{width: '30%', maxWidth: '120px', margin: '5px auto', display: 'block'}}/>
                        <b>PALEObooks</b> è un'applicazione per lo scambio dei libri usati sviluppata dagli studenti
                        di <b>EsperiaDev</b> dell'<Link href="https://itispaleocapa.edu.it" target="_blank">ITIS P.
                        Paleocapa</Link> di Bergamo in collaborazione con l'<Link href="https://www.agesp.eu/"
                                                                                  target="_blank">Associazione
                        Genitori Esperia</Link>.
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Per problemi e chiarimenti: <Link href="mailto:info@paleobooks.it"
                                                          target="_blank">info@paleobooks.it</Link>.
                    </Typography>
                </Paper>
                <Paper style={{margin: '15px auto', padding: '10px', maxWidth: '1000px', textAlign: 'center'}}>
                    {this.state.developers.map(d => {
                        return <AboutUsPerson developer={d} />
                    })}
                </Paper>
            </>
        );
    }
}

export default AboutUsPage;
