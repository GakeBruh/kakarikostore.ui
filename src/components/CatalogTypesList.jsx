import { useState, useEffect } from 'react';
import { catalogTypeService } from '../services';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import CatalogTypeForm from './CatalogTypeForm';

const CatalogTypesList = () => {
  const [catalogTypes, setCatalogTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { validateToken } = useAuth();

  useEffect(() => {
    loadCatalogTypes();
  }, []);

  const loadCatalogTypes = async () => {
    if (!validateToken()) return;
    try {
      setLoading(true);
      const data = await catalogTypeService.getAll();
      setCatalogTypes(data);
    } catch (err) {
      setError(err.message || 'Error al cargar');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (item) => {
    if (!validateToken()) return;
    if (window.confirm(`Eliminar ${item.description}?`)) {
      await catalogTypeService.deactivate(item.id);
      loadCatalogTypes();
    }
  };

  const handleFormSuccess = async () => {
    await loadCatalogTypes();
    setShowForm(false);
  };

  const filteredCatalogs = catalogTypes.filter((ct) =>
    ct.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-4 text-center">Cargando...</div>;
  }

  return (
    <Layout>
      <div className="w-full flex items-center justify-center pt-2 px-0">
        <div className="container max-w-9xl">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 text-center">
              <h2 className="text-xl font-bold text-gray-800">Tipos de Catálogo</h2>
              <p className="text-gray-500 mt-1">
                Gestiona los tipos de catálogo y sus productos asociados.
              </p>
              <button
                onClick={handleCreate}
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150"
              >
                + Nuevo Tipo
              </button>
            </div>

            {/* Search */}
            <div className="p-6 flex justify-center">
              <input
                type="text"
                className="pl-3 pr-3 py-2 border border-gray-300 rounded-lg w-full max-w-md text-gray-900 placeholder-gray-400"
                placeholder="Buscar tipo de catálogo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-10 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-10 py-5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Productos
                    </th>
                    <th className="px-10 py-5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-10 py-5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCatalogs.length > 0 ? (
                    filteredCatalogs.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{item.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{item.number_of_products || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {item.active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-gray-500">
                        No hay registros
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <CatalogTypeForm
          item={editingItem}
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}
    </Layout>
  );
};

export default CatalogTypesList;
