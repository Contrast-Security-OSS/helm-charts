import React, { useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import { Code } from "./components/code";
import { Frame } from "./components/frame";
import { Chart, ChartIndex, getChartIndex } from './helm-api';
import { DateTime } from "luxon";

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

    console.log(index);

    return (
        <Frame>
            {!index && (
                <div>Loading...</div>
            )}
            {!!index && (
                <RenderIndex index={index} />
            )}
        </Frame >
    );
}

function RenderIndex({ index }: { index: ChartIndex }) {

    const usageText = `# Add this Helm repository:
$ helm repo add contrast https://contrastsecurity.dev/helm-charts
$ helm repo update contrast

# Locate available charts.
$ helm search repo contrast

# Show the supported values for a chart.
$ helm show values contrast/contrast-agent-operator`;

    return (
        <div className="d-flex flex-column align-items-center w-100">

            <h2 className="mt-4">Usage</h2>
            <Code>{usageText}</Code>

            <h2 className="mt-4">Charts</h2>
            {index.charts.map(x => (
                <RenderChart key={x.name} chart={x} />
            ))}

            <div className="my-4"></div>

            <footer className="mt-4 text-muted" title={index.generated}>
                Index generated on {DateTime.fromISO(index.generated).toLocaleString()}
            </footer>
        </div>
    )
}

function RenderChart({ chart }: { chart: Chart }) {

    let { name, description, homeUrl, latestVersion, versions } = chart;

    let olderVersionsCount = versions.length - 1;

    return (
        <div className="w-100 d-flex flex-column rounded border mb-2">
            <div className="d-flex flex-column p-3">
                <div className="d-flex align-items-center mb-2">
                    <h3 className="m-0 fs-2 fw-lighter">{name}</h3>
                    <div className="ms-2 rounded border px-2" style={{ fontSize: "0.9rem" }}>
                        <span className="fw-bolder" title="Chart version.">{latestVersion.version}</span>
                        <span>/</span>
                        <span className="" title="App version.">{latestVersion.appVersion}</span>
                    </div>
                    <div className="ms-2 rounded border px-2" style={{ fontSize: "0.9rem" }} title={latestVersion.created}>
                        {DateTime.fromISO(latestVersion.created).toLocaleString()}
                    </div>
                </div>

                <div className="text-muted">
                    {description}
                </div>
            </div>
            <Code className="rounded-0">$ helm install my-release-name contrast/{name}</Code>

            <div className="p-3 d-flex justify-content-evenly">
                <a href="#">
                    {olderVersionsCount == 0 && (
                        <span>See 0 older versions</span>
                    )}
                    {olderVersionsCount == 1 && (
                        <span>See {olderVersionsCount} older version</span>
                    )}
                    {olderVersionsCount > 1 && (
                        <span>See {olderVersionsCount} older versions</span>
                    )}
                </a>
                <a href={homeUrl} target="_blank">
                    Documentation
                </a>
                <a href="#">
                    Supported values
                </a>
            </div>

        </div>
    )
}

