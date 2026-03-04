import React,{useState,useEffect} from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';
import TableHeader from "../../molecules/TableHeader";
import Loader from "../../atoms/Loader";
import Pagination from "../../atoms/Pagination";
import { useConfigStore } from "../../../stores/configStore";
import type { Config } from "../../../types/common";
import { HelpCircle, CheckCircle, XCircle, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { truncate } from '../../utils/helper'
import { PAGINATION_CONFIG } from '../../../constants/pagination';

interface StatFilter{
    id:string;
    title:string;
    value:number;
    trend:'up'|'down';
    change:string;
    icon:React.ReactNode;
}

const ConfigListTemplate:React.FC=()=>{
    const navigate=useNavigate();
    const {configs,getAllConfigs,deleteConfig,configstats,toggleConfigStatus,totalPages,stats,loading,error}=useConfigStore();
    const[searchTerm,setSearchTerm]=useState('');
    const[currentPage,setCurrentPage]=useState<number>(PAGINATION_CONFIG.DEFAULT_PAGE);
    type FilterType='total'|'active'|'inactive';
    const [selectedFilter,setSelectedFilter]=useState<FilterType>('total');
    useEffect(()=>{
        const loadData=async()=>{
            try {
                await getAllConfigs(currentPage,PAGINATION_CONFIG.DEFAULT_LIMIT,selectedFilter);
                await configstats();
            } catch (err:any) {
                toast.error(err?.message||'Failed to fetch Configs.Please try again.');
            }
        }
        loadData();
        
    },[currentPage,selectedFilter,getAllConfigs]);
    useEffect(()=>{
        if(error){
            toast.error(error);
        }
    },[error]);
    const handlePageChange=(selectedItem:{selected:number})=>{
        setCurrentPage(selectedItem.selected+1);
    }
    const filteredConfigs=configs.filter((config)=>{
        if(selectedFilter==='active'&& config.status!=='active')
            return false;
        if(selectedFilter==='inactive'&& config.status!=='inactive')
            return false;
        return config.name.toLowerCase().includes(searchTerm.toLowerCase());

    })
    /**
   * Calculates statistics for FAQs including total count, active count, and percentages
   * @returns {StatFilter[]}
   */
  const calculateStats=():StatFilter[]=>{
    const total = stats.total;
        const active = stats.active;
        const inactive = stats.inactive;
        const activePercent = total > 0 ? Math.round((active / total) * 100) : 0;
        const inactivePercent = total > 0 ? Math.round((inactive / total) * 100) : 0;
    
        return [
          {
            id: 'total',
            title: 'Total',
            value: total,
            trend: 'up' as const,
            change: '100%',
            icon: <HelpCircle size={20} />,
          },
          {
            id: 'active',
            title: 'Active',
            value: active,
            trend: 'up' as const,
            change: `${activePercent}%`,
            icon: <CheckCircle size={20} />,
          },
          {
            id: 'inactive',
            title: 'Inactive',
            value: inactive,
            trend: 'down' as const,
            change: `${inactivePercent}%`,
            icon: <XCircle size={20} />,
          },
        ];
  }
  const statFilters:StatFilter[]=calculateStats();
  const handleToggleStatus = async (config: Config) => {
      const newStatus = config.status === 'active' ? 'inactive' : 'active';
      const action = newStatus === 'active' ? 'activate' : 'deactivate';
  
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to ${action} this Category?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `Yes, ${action} it!`
      });
  
      if (result.isConfirmed) {
        try {
          await toggleConfigStatus(config._id!);
          await getAllConfigs(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter);
          await configstats();
          toast.success(`Config ${action}d successfully!`);
        } catch (error) {
          toast.error('Failed to update status. Please try again.');
        }
      }
    };
   const handleDelete = (config: Config) => {
      Swal.fire({
        title: 'Are you sure?',
        text: `You are about to delete "${config.name}"`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteConfig(config._id!);
  
            const updatedLength = filteredConfigs.length - 1;
            const newTotalItems = configs.length - 1;
            const newTotalPages = Math.ceil(newTotalItems / PAGINATION_CONFIG.DEFAULT_LIMIT);
            if (updatedLength === 0 && currentPage > newTotalPages) {
              const newPage = Math.max(newTotalPages || 1, 1);
              setCurrentPage(newPage);
              await configstats();
              await getAllConfigs(newPage, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter);
             
            } else {
               await configstats();
              await getAllConfigs(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter);
            }
  
            Swal.fire('Deleted!', 'The Config has been removed.', 'success');
          } catch (error) {
            toast.error('Failed to delete Category. Please try again.');
          }
        }
      });
    };
    if(loading)
        return <Loader/>;
    return(
        <div className="p-6">
      <TableHeader
        managementName="Config"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add"
        addButtonLink="/config/add"
        statFilters={statFilters}
        selectedFilterId={selectedFilter}
        onSelectFilter={(id) => {
          setSelectedFilter(id as 'total' | 'active' | 'inactive');
          setCurrentPage(1);
        }}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.NO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Options Count</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredConfigs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                filteredConfigs.map((config: Config, index: number) => (
                  <tr key={config._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(currentPage - 1) * PAGINATION_CONFIG.DEFAULT_LIMIT + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {truncate(config.name, 40)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {config.options.length}
                    </td>
                     <td className="px-4 py-2">
                                          <button   onClick={() => handleToggleStatus(config)}
                                            className={`${config.status === 'active' ? 'text-green-500 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'} transition`}
                                            title="Toggle Status"
                                          >
                                            {config.status === 'active' ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                                          </button>
                                        </td>
                    <td className="px-4 py-2 flex gap-3 items-center">
                      <button
                        onClick={() => navigate(`/config/edit/${config._id}`)}
                        className="bg-transparent text-indigo-500 hover:text-indigo-700 p-2 rounded"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(config)}
                        className="bg-transparent text-red-500 hover:text-red-700 p-2 rounded"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            pageCount={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
    )
}
export default ConfigListTemplate;