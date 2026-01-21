import { FolderOpen, Upload, Image, FileText, Film, Archive } from 'lucide-react'

export default function Files() {
  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Archivos</h1>
            <p className="text-gray-500 text-sm">Gestión de archivos y entregas</p>
          </div>
          <button className="btn-primary flex items-center gap-2 opacity-50 cursor-not-allowed" disabled>
            <Upload className="w-5 h-5" />Subir archivo
          </button>
        </div>
      </header>

      <div className="p-8">
        <div className="card max-w-2xl mx-auto text-center py-12">
          <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FolderOpen className="w-10 h-10 text-primary-500" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Gestión de archivos</h2>
          <p className="text-gray-600 mb-8">Próximamente podrás subir y organizar archivos para cada solicitud.</p>

          <div className="grid grid-cols-2 gap-4 text-left mb-8">
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><Image className="w-5 h-5 text-blue-600" /></div>
              <div><div className="font-medium">Imágenes</div><div className="text-sm text-gray-500">PNG, JPG, SVG</div></div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><FileText className="w-5 h-5 text-purple-600" /></div>
              <div><div className="font-medium">Documentos</div><div className="text-sm text-gray-500">PDF, DOC</div></div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"><Film className="w-5 h-5 text-red-600" /></div>
              <div><div className="font-medium">Videos</div><div className="text-sm text-gray-500">MP4, MOV</div></div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"><Archive className="w-5 h-5 text-yellow-600" /></div>
              <div><div className="font-medium">Comprimidos</div><div className="text-sm text-gray-500">ZIP, RAR</div></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
