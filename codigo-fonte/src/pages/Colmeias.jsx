import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { api } from '../services/api';
import Modal from '../components/Modal';
import Paginacao from '../components/Paginacao';

const FORM_INICIAL = {
  name: '',
  frameType: '',
  colonyOrigin: '',
  boxCount: '',
  queenRequest: {
    identificationNumber: '',
    origin: '',
    breed: '',
    color: '',
    birthDat: '',
  },
};

export default function Colmeias() {
  const { apiarioId } = useParams();
  const location = useLocation();
  const nomeApiario = location.state?.nome || `Apiário #${apiarioId}`;
  const navigate = useNavigate();

  const [colmeias, setColmeias] = useState([]);
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
      const dados = await api.colmeias.listar(apiarioId, pagina);
      setColmeias(dados.content || []);
      setTotalPaginas(dados.totalPages || 0);
    } catch {
      alert('Erro ao carregar colmeias.');
    } finally {
      setCarregando(false);
    }
  }, [apiarioId, pagina]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleQueenChange(e) {
    setForm({
      ...form,
      queenRequest: { ...form.queenRequest, [e.target.name]: e.target.value },
    });
  }

  async function handleSalvar(e) {
    e.preventDefault();
    setSalvando(true);
    try {
      await api.colmeias.criar(apiarioId, {
        ...form,
        boxCount: parseInt(form.boxCount),
      });
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
      await api.colmeias.deletar(id);
      setConfirmandoDeletar(null);
      carregar();
    } catch {
      alert('Erro ao excluir a colmeia.');
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <Link to="/apiarios" className="hover:text-amber-600 transition">Apiários</Link>
        <span>/</span>
        <span className="text-gray-600 font-medium">{nomeApiario}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Colmeias</h1>
          <p className="text-gray-500 text-sm mt-1">{nomeApiario}</p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2 rounded-lg transition flex items-center gap-2"
        >
          <span className="text-lg">+</span> Nova Colmeia
        </button>
      </div>

      {carregando ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        </div>
      ) : colmeias.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <span className="text-5xl block mb-3">🍯</span>
          <p className="font-medium">Nenhuma colmeia cadastrada</p>
          <p className="text-sm mt-1">Clique em "Nova Colmeia" para adicionar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colmeias.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition cursor-pointer"
              onClick={() =>
                navigate(`/colmeias/${c.id}/inspecoes`, { state: { nome: c.name } })
              }
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-gray-800">{c.name}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{c.frameType}</p>
                </div>
                <span className="text-2xl">🍯</span>
              </div>

              <div className="mt-3 space-y-1">
                <p className="text-xs text-gray-500">
                  <span className="font-medium text-gray-600">Origem:</span> {c.colonyOrigin}
                </p>
                <p className="text-xs text-gray-500">
                  <span className="font-medium text-gray-600">Caixas:</span> {c.boxCount}
                </p>
                {c.queen && (
                  <>
                    <p className="text-xs text-gray-500">
                      <span className="font-medium text-gray-600">Rainha:</span> {c.queen.identificationNumber}
                    </p>
                    <p className="text-xs text-gray-500">
                      <span className="font-medium text-gray-600">Raça:</span> {c.queen.breed}
                    </p>
                  </>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-amber-600 font-medium">Ver inspeções →</span>
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmandoDeletar(c); }}
                  className="text-xs text-red-400 hover:text-red-600 transition font-medium"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Paginacao pagina={pagina} totalPaginas={totalPaginas} onMudar={setPagina} />

      {modalAberto && (
        <Modal titulo="Nova Colmeia" onFechar={() => { setModalAberto(false); setForm(FORM_INICIAL); }}>
          <form onSubmit={handleSalvar} className="space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Dados da Colmeia</p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nome *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Colmeia 01"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de Quadro *</label>
                <input
                  name="frameType"
                  value={form.frameType}
                  onChange={handleChange}
                  required
                  placeholder="Langstroth"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Origem da Colônia *</label>
                <input
                  name="colonyOrigin"
                  value={form.colonyOrigin}
                  onChange={handleChange}
                  required
                  placeholder="Enxameio"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Qtd. Caixas *</label>
                <input
                  name="boxCount"
                  type="number"
                  min="1"
                  value={form.boxCount}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide pt-2">Dados da Rainha</p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Identificação *</label>
                <input
                  name="identificationNumber"
                  value={form.queenRequest.identificationNumber}
                  onChange={handleQueenChange}
                  required
                  placeholder="RA-2026-001"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Origem *</label>
                <input
                  name="origin"
                  value={form.queenRequest.origin}
                  onChange={handleQueenChange}
                  required
                  placeholder="Apiário próprio"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Raça *</label>
                <input
                  name="breed"
                  value={form.queenRequest.breed}
                  onChange={handleQueenChange}
                  required
                  placeholder="Africanizada"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Cor *</label>
                <input
                  name="color"
                  value={form.queenRequest.color}
                  onChange={handleQueenChange}
                  required
                  placeholder="Amarela"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nascimento *</label>
                <input
                  name="birthDat"
                  type="date"
                  value={form.queenRequest.birthDat}
                  onChange={handleQueenChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
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
            Tem certeza que deseja excluir a colmeia <strong>{confirmandoDeletar.name}</strong>?
            Todas as inspeções vinculadas também serão removidas.
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
