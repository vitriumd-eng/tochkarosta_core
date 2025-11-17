/**
 * Dynamic Module Router - Catches all routes for module pages
 * Loads module based on subdomain/tenant active_module
 */
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

async function getTenantModuleInfo() {
  const headersList = headers()
  const subdomain = headersList.get('X-Tenant-Subdomain')
  
  // Extract subdomain from host header if not in custom header
  if (!subdomain) {
    const host = headersList.get('host') || ''
    const hostWithoutPort = host.split(':')[0]
    const parts = hostWithoutPort.split('.')
    if (parts.length > 1 && !['www', 'api', 'admin'].includes(parts[0])) {
      const extractedSubdomain = parts[0]
      if (extractedSubdomain !== 'localhost') {
        // Fetch tenant and module info from backend
        try {
          const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'
          const tenantResponse = await fetch(`${backendUrl}/api/v1/tenants/by-subdomain/${extractedSubdomain}`, {
            headers: {
              'X-Request-ID': headersList.get('X-Request-ID') || ''
            },
            cache: 'no-store'
          })
          
          if (tenantResponse.ok) {
            const tenantData = await tenantResponse.json()
            return {
              subdomain: extractedSubdomain,
              tenantId: tenantData.tenant_id,
              activeModule: tenantData.active_module,
              moduleInfo: tenantData.module_info
            }
          }
        } catch (error) {
          console.error('Failed to fetch tenant info:', error)
        }
      }
    }
    return null
  }
  
  // Fetch tenant and module info from backend using subdomain
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'
    const tenantResponse = await fetch(`${backendUrl}/api/v1/tenants/by-subdomain/${subdomain}`, {
      headers: {
        'X-Request-ID': headersList.get('X-Request-ID') || ''
      },
      cache: 'no-store'
    })
    
    if (tenantResponse.ok) {
      const tenantData = await tenantResponse.json()
      return {
        subdomain,
        tenantId: tenantData.tenant_id,
        activeModule: tenantData.active_module,
        moduleInfo: tenantData.module_info
      }
    }
  } catch (error) {
    console.error('Failed to fetch tenant info:', error)
  }
  
  return null
}

export default async function ModulePage({
  params,
}: {
  params: { slug: string[] }
}) {
  const headersList = headers()
  const host = headersList.get('host') || ''
  const hostWithoutPort = host.split(':')[0]
  const parts = hostWithoutPort.split('.')
  
  // Extract subdomain: shop.localhost:7000 -> shop
  // Also handle shop.localhost without port
  let subdomain: string | null = null
  if (parts.length > 1) {
    const firstPart = parts[0]
    // Exclude www, api, admin, but include shop
    if (firstPart !== 'localhost' && !['www', 'api', 'admin'].includes(firstPart)) {
      subdomain = firstPart
    }
  }
  
  // For development: if subdomain is 'shop', load shop module directly
  if (subdomain === 'shop') {
    const route = params.slug ? `/${params.slug.join('/')}` : '/'
    
    // Dynamic import of shop module pages
    try {
      // Map routes to shop module pages
      // Using webpack alias configured in next.config.js
      if (route === '/' || route === '/home') {
        const ShopHomePage = (await import('@modules/shop/frontend/app/home/page')).default
        return <ShopHomePage />
      } else if (route === '/catalog') {
        const ShopCatalogPage = (await import('@modules/shop/frontend/app/catalog/page')).default
        return <ShopCatalogPage />
      } else if (route.startsWith('/product/')) {
        const productId = route.split('/product/')[1] || ''
        const ShopProductPage = (await import('@modules/shop/frontend/app/product/[id]/page')).default
        // Need to pass productId as param
        return <ShopProductPage params={{ id: productId }} />
      } else if (route === '/cart') {
        const ShopCartPage = (await import('@modules/shop/frontend/app/cart/page')).default
        return <ShopCartPage />
      } else if (route === '/admin/products') {
        const ShopAdminProductsPage = (await import('@modules/shop/frontend/app/admin/products/page')).default
        return <ShopAdminProductsPage />
      } else {
        notFound()
      }
    } catch (error) {
      console.error('Failed to load shop module page:', error)
      notFound()
    }
  }
  
  // Original logic for production tenant-based routing
  const moduleData = await getTenantModuleInfo()
  
  // If no module data, show 404
  if (!moduleData) {
    notFound()
  }
  
  const { activeModule, moduleInfo } = moduleData
  const route = params.slug ? `/${params.slug.join('/')}` : '/'
  
  // Check if route is in module's public routes
  const publicRoutes = moduleInfo?.publicRoutes || []
  const dashboardRoutes = moduleInfo?.dashboardRoutes || []
  
  // Determine if route is public or dashboard
  const isDashboardRoute = dashboardRoutes.some((r: string) => {
    const pattern = r.replace(/:[^/]+/g, '[^/]+')
    const regex = new RegExp(`^${pattern}$`)
    return regex.test(route)
  })
  
  const isPublicRoute = publicRoutes.some((r: string) => {
    const pattern = r.replace(/:[^/]+/g, '[^/]+')
    const regex = new RegExp(`^${pattern}$`)
    return regex.test(route)
  })
  
  // If route doesn't match module routes, show 404
  if (!isPublicRoute && !isDashboardRoute) {
    notFound()
  }
  
  // Load module page
  // In production, this would dynamically import from modules/{activeModule}/frontend
  // For now, return a placeholder that will be replaced with actual module pages
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Module: {activeModule}
        </h1>
        <p className="text-gray-600 mb-2">Route: {route}</p>
        <p className="text-sm text-gray-500">
          Module page will be loaded here
        </p>
        <p className="text-xs text-gray-400 mt-4">
          To implement: Load page from modules/{activeModule}/frontend/app/{isDashboardRoute ? 'admin' : 'home'}/page.tsx
        </p>
      </div>
    </div>
  )
}

