import { useState, useEffect } from 'react';
import { catalogService, catalogTypeService } from '../services';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import CatalogForm from './CatalogForm';

const CatalogsList = () => {
  const [catalogs, setCatalogs] = useState([]);
  const [catalogTypes, setCatalogTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [recentlyUpdated, setRecentlyUpdated] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { validateToken } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (recentlyUpdated) {
      const timer = setTimeout(() => {
        setRecentlyUpdated(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [recentlyUpdated]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const catalogsData = await catalogService.getAll();
      setCatalogs(catalogsData["catalogs"]);

      try {
        const catalogTypesData = await catalogTypeService.getAll();
        setCatalogTypes(catalogTypesData);
      } catch (typeError) {
        console.warn('Error al cargar tipos de catálogo:', typeError);
        setCatalogTypes([]);
      }

    } catch (error) {
      console.error('Error al cargar catálogos:', error);
      setError(error.message || 'Error al cargar los catálogos');
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

    const confirmed = window.confirm(
      `¿Estás seguro de eliminar el catálogo "${item.name}"?\n\nEsta acción no se puede deshacer.`
    );

    if (confirmed) {
      try {
        setError('');
        await catalogService.deactivate(item.id);
        await loadData();
        setSuccessMessage('Catálogo eliminado exitosamente');
      } catch (error) {
        console.error('Error al eliminar:', error);
        setError(error.message || 'Error al eliminar el catálogo');
      }
    }
  };

  const handleFormSuccess = async (savedItem, isEdit = false) => {
    await loadData();
    setRecentlyUpdated(savedItem.id);
    setSuccessMessage(isEdit ? 'Catálogo actualizado exitosamente' : 'Catálogo creado exitosamente');
    setShowForm(false);
    setEditingItem(null);
    setError('');
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const getCatalogTypeName = (catalog) => {
    return catalog.catalog_type_description || 'Tipo no encontrado';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL'
    }).format(amount);
  };

  const calculateFinalPrice = (cost, discount) => {
    const discountAmount = (cost * discount) / 100;
    return cost - discountAmount;
  };

  const filteredCatalogs = catalogs.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-4 text-center">Cargando catálogos...</div>;
  }

  return (
    <Layout>
      <div className="w-full flex items-center justify-center min-h-full p-4">
        <div className="container max-w-9xl">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-200 text-center">
              <h2 className="text-xl font-bold text-gray-800">Catálogos</h2>
              <p className="text-gray-500 mt-1">
                Gestiona los catálogos registrados y sus tipos asociados.
              </p>
              <button
                onClick={handleCreate}
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150"
              >
                + Nuevo Catálogo
              </button>
            </div>

            {/* Mensajes */}
            {successMessage && (
              <div className="mx-6 mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                <div className="flex items-center">
                  <span className="mr-2">✅</span>
                  <span>{successMessage}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                <div className="flex items-center">
                  <span className="mr-2">❌</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Search */}
            <div className="p-6 flex justify-center">
              <input
                type="text"
                className="pl-3 pr-3 py-2 border border-gray-300 rounded-lg w-full max-w-md text-gray-900 placeholder-gray-400"
                placeholder="Buscar catálogo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Costo
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descuento
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio Final
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCatalogs.length > 0 ? (
                    filteredCatalogs.map((item) => (
                      <tr
                        key={item.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          recentlyUpdated === item.id
                            ? 'bg-green-50 border-l-4 border-green-400'
                            : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getCatalogTypeName(item)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(item.cost)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.discount > 0 ? (
                            <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                              {item.discount}%
                            </span>
                          ) : (
                            <span className="text-gray-400">Sin descuento</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.discount > 0 ? (
                            <div className="flex flex-col">
                              <span className="text-green-600">
                                {formatCurrency(calculateFinalPrice(item.cost, item.discount))}
                              </span>
                              <span className="text-xs text-gray-400 line-through">
                                {formatCurrency(item.cost)}
                              </span>
                            </div>
                          ) : (
                            formatCurrency(item.cost)
                          )}
                        </td>
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
                          {item.active && (
                            <button
                              onClick={() => handleDelete(item)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Eliminar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-gray-500">
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
        <CatalogForm
          item={editingItem}
          catalogTypes={catalogTypes}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
    </Layout>
  );
};

export default CatalogsList;
