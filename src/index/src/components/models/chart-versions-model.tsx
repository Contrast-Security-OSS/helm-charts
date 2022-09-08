
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Chart, ChartVersion } from '../../helm-api';
import { Cell } from '../cell';
import { Code } from '../code';
import { ChartVersionValuesModel } from './chart-version-values-model';

export interface ChartVersionsModelProps {
    show?: boolean;
    onHide?: () => void;
    chart: Chart;
}

export function ChartVersionsModel(props: ChartVersionsModelProps) {

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="lg"
            centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    All chart versions
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul className="list-group list-group-flush">
                    {props.chart.versions.map(x => (
                        <Version key={x.version} x={x} name={props.chart.name} />
                    ))}
                </ul>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

function Version({ x, name }: { x: ChartVersion, name: string }) {
    let [showValuesModel, setShowValuesModel] = useState<boolean>(false);
    return (
        <li className="list-group-item d-flex flex-column">
            <div className='d-flex'>
                <div className='d-flex align-items-center pe-4'>
                    v{x.version}
                </div>
                <div className='d-flex justify-content-evenly flex-fill'>
                    <div className='d-flex flex-column'>
                        <Cell label='App version'>v{x.appVersion}</Cell>
                    </div>
                    <div className='d-flex flex-column'>
                        <Cell label='Release date' title={x.created}>{DateTime.fromISO(x.created).toLocaleString()}</Cell>
                    </div>
                    <div className='d-flex flex-column'>
                        <Cell label='Required K8s version'>{x.kubeVersion}</Cell>
                    </div>
                    <div className='d-flex flex-column'>
                        <Cell label='Chart values'>
                            <a href="#" onClick={() => setShowValuesModel(true)}>values.yaml</a>
                        </Cell>
                    </div>
                    <div className='d-flex flex-column'>
                        <Cell label='Download chart'>
                            <div className='d-flex flex-column'>
                                {x.urls.map((url, i) => (
                                    <a key={i} href={url}>chart.tgz</a>
                                ))}
                            </div>
                        </Cell>
                    </div>
                </div>
            </div>
            <Code className='mt-3 mb-1'>$ helm install my-release-name contrast/{name} --version {x.version}</Code>
            <ChartVersionValuesModel chartName={name} chartVersion={x.version} show={showValuesModel} onHide={() => setShowValuesModel(false)} />
        </li>
    )
}


