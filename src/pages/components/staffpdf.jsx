import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

// Sample logo - replace with actual path or base64
const logo = '/images/au.png'; // Ensure this is valid

const styles = StyleSheet.create({
  page: {
    fontSize: 12,
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottom: '1 solid #000',
    paddingBottom: 10,
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    borderBottom: '1 solid #ccc',
    paddingVertical: 6,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottom: '2 solid #000',
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    fontWeight: 'bold',
  },
  cellKey: {
    width: '40%',
    fontWeight: 'bold',
    paddingRight: 8,
  },
  cellValue: {
    width: '60%',
  },
  publicationCell: {
    width: '20%',
    paddingRight: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'green',
    textDecoration: 'underline',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    borderTop: '1 solid #000',
    paddingTop: 10,
  },
});

const getFormattedDate = () => {
  const date = new Date(Date.now());
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const InfoPDF = ({ Info, publications }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Image src={logo} style={styles.logo} />
        <View>
          <Text style={styles.headerText}>ANNAMALAI UNIVERSITY</Text>
          <Text>DEPARTMENT OF INFORMATION TECHNOLOGY</Text>
        </View>
      </View>

      {/* Title and Date */}
      <View style={styles.titleContainer}>
        <Text style={{ color: 'green', fontWeight: 'bold', textDecoration: 'underline' }}>
          DATA SHEET
        </Text>
        <Text style={{ fontWeight: 'bold', color: 'blue' }}>
          Generated on: {getFormattedDate()}
        </Text>
      </View>

      {/* Staff Information Table */}
      <View style={styles.table}>
        <Text style={styles.sectionTitle}>Staff Information</Text>
        {Object.entries(Info || {}).map(([key, value]) => (
          <View key={key} style={styles.row}>
            <Text style={styles.cellKey}>{key.replace(/([A-Z])/g, ' $1')}</Text>
            <Text style={styles.cellValue}>{value || 'N/A'}</Text>
          </View>
        ))}
      </View>

      {/* Publications Table */}
      <View style={styles.table}>
        <Text style={styles.sectionTitle}>Publications</Text>
        <View style={styles.headerRow}>
          <Text style={styles.publicationCell}>Title</Text>
          <Text style={styles.publicationCell}>Journal</Text>
          <Text style={styles.publicationCell}>Publication Date</Text>
          <Text style={styles.publicationCell}>DOI</Text>
          <Text style={styles.publicationCell}>Authors</Text>
        </View>
        {publications && Array.isArray(publications) && publications.length > 0 ? (
          publications.map((pub, index) => (
            <View key={`pub-${index}`} style={styles.row}>
              <Text style={styles.publicationCell}>{pub.title || 'N/A'}</Text>
              <Text style={styles.publicationCell}>{pub.journal || 'N/A'}</Text>
              <Text style={styles.publicationCell}>{pub.publicationDate || 'N/A'}</Text>
              <Text style={styles.publicationCell}>{pub.doi || 'N/A'}</Text>
              <Text style={styles.publicationCell}>{pub.authors || 'N/A'}</Text>
            </View>
          ))
        ) : (
          <View style={styles.row}>
            <Text style={styles.publicationCell}>No Publications</Text>
            <Text style={styles.publicationCell}>N/A</Text>
            <Text style={styles.publicationCell}>N/A</Text>
            <Text style={styles.publicationCell}>N/A</Text>
            <Text style={styles.publicationCell}>N/A</Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Address: Annamalai Nagar, Chidambaram, Tamil Nadu - 608002</Text>
      </View>
    </Page>
  </Document>
);

export default InfoPDF;