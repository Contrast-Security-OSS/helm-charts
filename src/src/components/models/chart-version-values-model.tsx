import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { getChartVersionValues, getChartVersionValuesLink } from '../../helm-api';
import { Code } from '../code';

export interface ChartVersionValuesModelProps {
    show?: boolean;
    onHide?: () => void;
    chartName: string;
    chartVersion: string;
}

export function ChartVersionValuesModel(props: ChartVersionValuesModelProps) {

    let [valuesText, setValuesText] = useState<string | null>(null);

    useEffect(() => {
        getChartVersionValues(props.chartName, props.chartVersion)
            .then(x => {
                setValuesText(x);
            })
            .catch(x => {
                setValuesText("An error occurred.")
                console.warn(x);
            })
    }, [props.chartName, props.chartVersion])

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="lg"
            centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Values
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='d-flex'>
                    <Code>{valuesText ?? "Loading..."}</Code>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <a className='me-auto' href={getChartVersionValuesLink(props.chartName, props.chartVersion)} target="_blank">
                    Download {props.chartName}-{props.chartVersion}.yaml
                </a>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}
