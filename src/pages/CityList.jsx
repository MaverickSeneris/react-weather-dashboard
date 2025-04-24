import React from 'react'
import SearchBar from '../components/SearchBar'
import Header from '../components/ui/Header'
import PageContainer from '../components/ui/PageContainer'

function CityList() {
  return (
    <PageContainer>
      <Header title={"My Cities"}/>
      <SearchBar/>
    </PageContainer>
  )
}

export default CityList