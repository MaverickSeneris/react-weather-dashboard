import React from 'react'

const PageContainer = React.forwardRef(({ children }, ref) => {
  return (
    <div ref={ref} className='px-4 pt-8'>{children}</div>
  )
})

PageContainer.displayName = 'PageContainer'

export default PageContainer