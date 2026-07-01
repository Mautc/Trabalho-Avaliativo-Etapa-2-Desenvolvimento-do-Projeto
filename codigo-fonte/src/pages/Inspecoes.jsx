import { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { api } from '../services/api';
import Modal from '../components/Modal';
import Paginacao from '../components/Paginacao';

const FORM_INICIAL = {
  inspectionDate: new Date().toISOString().split('T')[0],
  queenSeen: false,
  eggsSeen: false,
  queenCellsSeen: false,
  queenless: false,
  broodPattern: '',
  colonyStrength: '',
  observations: '',
};

function BadgeBoolean({ valor, textoSim, textoNao }) {
  return (
    <span
      className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
        valor
          ? 'bg-green-100 text-green-700'
          : 'bg-gray-100 text-gray-500'
      }`}
    >
      {valor ? textoSim : textoNao}
    </span>
  );
}

export default function Inspecoes() {
  const { colmeiaId } = useParams();
  const location = useLocation();
  const nomeColmeia = location.state?.nome || `Colmeia #${colmeiaId}`;

  const [inspecoes, setInspecoes] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState(FORM_INICIAL);
  const [salvando, setSalvando] = useState(false);
  const [confirmandoDeletar, setConfirmandoDeletar] = useState(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const dados = await api.inspecoes.listar(colmeiaId, pagina);
      setInspecoes(dados.content || []);
      setTotalPaginas(dados.totalPages || 0);
    } catch {
      alert('Erro ao carregar inspeções.');
    } finally {
      setCarregando(false);
    }
  }, [colmeiaId, pagina]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function handleChange(e) {
    const { name, type, checked, value } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  }

  async function handleSalvar(e) {
    e.preventDefault();
    setSalvando(true);
    try {
      await api.inspecoes.criar(colmeiaId, form);
      setModalAberto(false);
      setForm(FORM_INICIAL);
      carregar();
    } catch (err) {
      alert('Erro ao salvar: ' + err.message);
    } finally {
      setSalvando(false);
    }
  }

  async function handleDeletar(id) {
    try {
      await api.inspecoes.deletar(id);
      setConfirmandoDeletar(null);
      carregar();
    } catch {
      alert('Erro ao excluir a inspeção.');
    }
  }

  function formatarData(data) {
    if (!data) return '-';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <Link to="/apiarios" className="hover:text-amber-600 transition">Apiários</Link>
        <span>/</span>
        <button onClick={() => window.history.back()} className="hover:text-amber-600 transition">
          Colmeias
        </button>
        <span>/</span>
        <span className="text-gray-600 font-medium">{nomeColmeia}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inspeções</h1>
          <p className="text-gray-500 text-sm mt-1">{nomeColmeia}</p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2 rounded-lg transition flex items-center gap-2"
        >
          <span className="text-lg">+</span> Nova Inspeção
        </button>
      </div>

      {carregando ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        </div>
      ) : inspecoes.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <span className="text-5xl block mb-3">🔍</span>
          <p className="font-medium">Nenhuma inspeção registrada</p>
          <p className="text-sm mt-1">Clique em "Nova Inspeção" para registrar</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inspecoes.map((ins) => (
            <div
              key={ins.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-gray-800">
                    Inspeção de {formatarData(ins.inspectionDate)}
                  </h2>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <BadgeBoolean valor={ins.queenSeen} textoSim="Rainha vista" textoNao="Rainha não vista" />
                    <BadgeBoolean valor={ins.eggsSeen} textoSim="Ovos vistos" textoNao="Sem ovos" />
                    <BadgeBoolean valor={ins.queenCellsSeen} textoSim="Células reais" textoNao="Sem células reais" />
                    <BadgeBoolean valor={ins.queenless} textoSim="Orfã" textoNao="Com rainha" />
                  </div>
                </div>
                <button
                  onClick={() => setConfirmandoDeletar(ins)}
                  className="text-xs text-red-400 hover:text-red-600 transition font-medium ml-4 shrink-0"
                >
                  Excluir
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <p className="text-xs text-gray-500">
                  <span className="font-medium text-gray-600">Padrão de cria:</span> {ins.broodPattern}
                </p>
                <p className="text-xs text-gray-500">
                  <span className="font-medium text-gray-600">Força da colônia:</span> {ins.colonyStrength}
                </p>
              </div>

              {ins.observations && (
                <p className="text-xs text-gray-500 mt-2 border-t border-gray-100 pt-2">
                  <span className="font-medium text-gray-600">Observações:</span> {ins.observations}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <Paginacao pagina={pagina} totalPaginas={totalPaginas} onMudar={setPagina} />

      {modalAberto && (
        <Modal titulo="Nova Inspeção" onFechar={() => { setModalAberto(false); setForm(FORM_INICIAL); }}>
          <form onSubmit={handleSalvar} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Data da Inspeção *</label>
              <input
                name="inspectionDate"
                type="date"
                value={form.inspectionDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Padrão de Cria *</label>
                <input
                  name="broodPattern"
                  value={form.broodPattern}
                  onChange={handleChange}
                  required
                  placeholder="Compacto, Irregular..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Força da Colônia *</label>
                <input
                  name="colonyStrength"
                  value={form.colonyStrength}
                  onChange={handleChange}
                  required
                  placeholder="Fraca, Média, Forte..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-700 mb-2">Observações visuais</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'queenSeen', label: 'Rainha vista' },
                  { name: 'eggsSeen', label: 'Ovos vistos' },
                  { name: 'queenCellsSeen', label: 'Células reais' },
                  { name: 'queenless', label: 'Colmeia orfã' },
                ].map((campo) => (
                  <label key={campo.name} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name={campo.name}
                      checked={form[campo.name]}
                      onChange={handleChange}
                      className="w-4 h-4 accent-amber-500"
                    />
                    <span className="text-sm text-gray-700">{campo.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Observações</label>
              <textarea
                name="observations"
                value={form.observations}
                onChange={handleChange}
                rows={3}
                maxLength={1000}
                placeholder="Anotações adicionais sobre a inspeção..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setModalAberto(false); setForm(FORM_INICIAL); }}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg text-sm font-semibold transition disabled:opacity-60"
              >
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {confirmandoDeletar && (
        <Modal titulo="Confirmar Exclusão" onFechar={() => setConfirmandoDeletar(null)}>
          <p className="text-gray-600 text-sm mb-4">
            Tem certeza que deseja excluir a inspeção de{' '}
            <strong>{formatarData(confirmandoDeletar.inspectionDate)}</strong>?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setConfirmandoDeletar(null)}
              className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              onClick={() => handleDeletar(confirmandoDeletar.id)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold transition"
            >
              Excluir
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
