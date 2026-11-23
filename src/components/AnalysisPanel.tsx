import type { GraphAnalysis } from '../lib/analysis';
import { Badge } from './ui/Badge';
import { Icon } from './ui/Icon';

interface AnalysisPanelProps {
  analysis: GraphAnalysis;
  directed: boolean;
}

export function AnalysisPanel({
  analysis,
  directed,
}: AnalysisPanelProps) {
  const empty = analysis.n === 0;
  const simpleOk = !empty && analysis.isSimple;
  const connectedOk = !empty && analysis.isConnected;
  const bipartiteOk = !empty && analysis.isBipartite;
  const completeOk = !empty && analysis.isComplete;
  const eulerOk =
    analysis.eulerStatus === 'Circuito de Euler' ||
    analysis.eulerStatus === 'Camino de Euler';

  return (
    <section className="panel analysis">
      <div className="panel__head">
        <div>
          <span className="panel__kicker">02 / ANÁLISIS</span>
          <h2 className="panel__title">Estructura en vivo</h2>
        </div>
        <span className="panel__meta">AUTO</span>
      </div>

      <div className="panel__body">
        <div className="stats">
          <div className="stat">
            <span className="stat__label">Orden |V|</span>
            <strong className="stat__value">{analysis.n}</strong>
          </div>
          <div className="stat">
            <span className="stat__label">Tamaño |E|</span>
            <strong className="stat__value">{analysis.m}</strong>
          </div>
          <div className="stat">
            <span className="stat__label">Σ deg(v)</span>
            <strong className="stat__value">{analysis.degSum}</strong>
          </div>
        </div>

        <div className="handshake">
          <span className="handshake__label">
            Lema del apretón de manos
          </span>
          <span className="handshake__value">
            <Icon name="check" size={12} />
            {analysis.degSum} = 2 · {analysis.m}
          </span>
        </div>

        <div className="badges">
          <Badge
            label="Grafo simple"
            value={
              empty
                ? 'Vacío'
                : analysis.isSimple
                  ? 'Sí · sin bucles'
                  : 'No · multigrafo'
            }
            ok={simpleOk}
          />
          <Badge
            label="Conectividad"
            value={
              empty
                ? 'Vacío'
                : analysis.isConnected
                  ? 'Conexo · 1 comp.'
                  : `Disconexo · ${analysis.components} comp.`
            }
            ok={connectedOk}
          />
          <Badge
            label="Bipartido"
            value={
              empty
                ? 'Vacío'
                : analysis.isBipartite
                  ? 'Sí · 2-coloreable'
                  : 'No · ciclo impar'
            }
            ok={bipartiteOk}
          />
          <Badge
            label="Completo"
            value={
              empty
                ? 'Vacío'
                : analysis.isComplete
                  ? `Sí · K_${analysis.n}`
                  : 'No'
            }
            ok={completeOk}
          />
          <Badge
            label="Trayectoria de Euler"
            value={
              empty
                ? 'Sin aristas'
                : directed
                  ? 'N/A · digrafo'
                  : analysis.m === 0
                    ? 'Sin aristas'
                    : analysis.eulerStatus
            }
            ok={eulerOk}
            wide
          />
        </div>

        <div className="analysis__meta">
          <span>
            Componentes <b>{analysis.components}</b>
          </span>
          <span>
            Grados impares <b>{analysis.oddDegreeCount}</b>
          </span>
          <span>
            Bucles <b>{analysis.hasLoops ? 'sí' : 'no'}</b>
          </span>
        </div>
      </div>
    </section>
  );
}
