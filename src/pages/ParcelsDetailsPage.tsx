import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/layout/PageHeader';
import IndianParcelDetail from '../components/IndianParcelDetail';
import usePageMetadata from '../hooks/use-page-metadata';

const ParcelsDetailsPage = () => {
  const { 
    title, 
    description, 
    handleTitleChange, 
    handleDescriptionChange 
  } = usePageMetadata({
    defaultTitle: 'Indian Parcel Management',
    defaultDescription: 'Manage, monitor, and optimize your agricultural parcels across Indian states'
  });

  return (
    <PageLayout>
      <div className="p-6 animate-enter">
        <PageHeader 
          title={title}
          description={description}
          onTitleChange={handleTitleChange}
          onDescriptionChange={handleDescriptionChange}
        />

        <IndianParcelDetail />
      </div>
    </PageLayout>
  );
};

export default ParcelsDetailsPage;