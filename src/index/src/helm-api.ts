import YAML from 'js-yaml'

export async function getChartIndex(): Promise<ChartIndex> {
    const chartIndex = "index.yaml";
    let indexYaml = await fetch(chartIndex).then(response => response.text());
    let index = YAML.load(indexYaml) as any;
    return {
        generated: index.generated,
        charts: Object.keys(index.entries)
            .map<Chart>(name => {
                let versions = index.entries[name] as any[];
                let lastVersion = versions[versions.length - 1];
                return {
                    name: name,
                    description: lastVersion.description,
                    homeUrl: lastVersion.home,
                    latestVersion: lastVersion,
                    versions: versions.map<ChartVersion>(x => {
                        return {
                            appVersion: x.appVersion,
                            version: x.version,
                            created: x.created,
                            description: x.description,
                            digest: x.digest,
                            home: x.home,
                            kubeVersion: x.kubeVersion,
                            name: x.name,
                            sources: x.sources,
                            urls: x.urls,
                        };
                    })
                };
            })
    };
}

export async function getChartVersionValues(chartName: string, version: string) {
    let chartValues = `values/${chartName}-${version}.yaml`;
    let yaml = await fetch(chartValues).then(response => response.text());
    return yaml;
}

export interface ChartIndex {
    generated: string;
    charts: Chart[];
}


export interface Chart {
    name: string;
    homeUrl: string;
    description: string;
    versions: ChartVersion[];
    latestVersion: ChartVersion;
}

export interface ChartVersion {
    appVersion: string;
    version: string;
    created: string;
    digest: string;
    kubeVersion: string;
    urls: string[];
}
