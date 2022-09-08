import React, { useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import { Code } from "./components/code";
import { Frame } from "./components/frame";
import { Chart, ChartIndex, getChartIndex } from './helm-api';
import { DateTime } from "luxon";
import { ChartVersionsModel } from "./components/models/chart-versions-model";
import { ChartVersionValuesModel } from "./components/models/chart-version-values-model";
import { MdHelpOutline, MdAnchor, MdLabelOutline, MdOutlineDocumentScanner, MdCopyright } from "react-icons/md";
import { Cell } from "./components/cell";

(function () {
    let container = document.getElementById('app');
    if (container == null) {
        throw new Error("No app div found!");
    }

    createRoot(container).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
})();

function App() {

    let [index, setIndex] = useState<ChartIndex | null>(null);
    useEffect(() => void getChartIndex().then(setIndex).catch(console.warn), []);

    return (
        <Frame>
            <RenderIndex index={index} />
            <footer className="mt-4 text-muted d-flex justify-content-center" style={{ fontSize: "0.9rem" }}>
                <div className="">
                    {!!index && (
                        <>Helm index generated on <span title={index.generated}>{DateTime.fromISO(index.generated).toLocaleString()}</span> · </>
                    )}
                    Copyright <MdCopyright /> 2022 Contrast Security, Inc
                </div>
            </footer>
        </Frame >
    );
}

function RenderIndex({ index }: { index: ChartIndex | null }) {

    const usageText = `# Add this Helm repository:
$ helm repo add contrast https://contrastsecurity.dev/helm-charts

# Update your local repository cache.
$ helm repo update contrast`;

    return (
        <div className="d-flex flex-column align-items-center w-100">

            <h2 className="mt-4">Usage</h2>
            <Code>{usageText}</Code>

            <h2 className="mt-4">Charts</h2>

            {!index && (
                <div>Fetching index...</div>
            )}

            {!!index && index.charts.map(x => (
                <RenderChart key={x.name} chart={x} />
            ))}

            <div className="my-4"></div>
        </div>
    )
}

function RenderChart({ chart }: { chart: Chart }) {

    let { name, description, homeUrl, latestVersion, versions } = chart;

    let versionsCount = versions.length;

    let [showVersionsModel, setShowVersionsModel] = useState<boolean>(false);
    let [showValuesModel, setShowValuesModel] = useState<boolean>(false);

    return (
        <div className="w-100 d-flex flex-column rounded border mb-2">
            <div className="d-flex flex-column p-3">
                <div className="d-flex align-items-center mb-2">
                    <h3 className="m-0 fs-2 fw-lighter d-flex align-items-center">
                        <MdAnchor className="me-2" />
                        {name}
                    </h3>
                    <div className="d-flex ms-auto">
                        <Cell label="Chart version">
                            v{latestVersion.version}
                        </Cell>
                        <Cell label="App version" className="ms-3">
                            v{latestVersion.appVersion}
                        </Cell>
                        <Cell label="Release date" title={latestVersion.created} className="ms-3">
                            {DateTime.fromISO(latestVersion.created).toLocaleString()}
                        </Cell>
                    </div>
                </div>

                <div className="text-muted">
                    {description}
                </div>
            </div>
            <Code className="rounded-0">$ helm install my-release-name contrast/{name}</Code>

            <div className="p-3 d-flex justify-content-evenly">
                <div className="d-flex align-items-center">
                    <MdLabelOutline className="me-1" />
                    <a href="#" onClick={() => setShowVersionsModel(true)}>
                        See {versionsCount} versions
                    </a>
                </div>
                <div className="d-flex align-items-center">
                    <MdHelpOutline className="me-1" />
                    <a href={homeUrl} target="_blank">
                        Documentation
                    </a>
                </div>
                <div className="d-flex align-items-center">
                    <MdOutlineDocumentScanner className="me-1" />
                    <a href="#" onClick={() => setShowValuesModel(true)}>
                        Supported values
                    </a>
                </div>
            </div>

            <ChartVersionsModel chart={chart} show={showVersionsModel} onHide={() => setShowVersionsModel(false)} />
            <ChartVersionValuesModel chartName={chart.name} chartVersion={latestVersion.version} show={showValuesModel} onHide={() => setShowValuesModel(false)} />
        </div>
    )
}

