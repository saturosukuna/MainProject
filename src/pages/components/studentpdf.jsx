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
  academicCell: {
    width: '25%',
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

const InfoPDF = ({ Info, academicMarks }) => (
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

      {/* Academic Marks Table */}
      <View style={styles.table}>
        <Text style={styles.sectionTitle}>Academic Marks</Text>
        <View style={styles.headerRow}>
          <Text style={styles.academicCell}>Semester</Text>
          <Text style={styles.academicCell}>CGPA</Text>
          <Text style={styles.academicCell}>OGPA</Text>
          <Text style={styles.academicCell}>Percentage</Text>
        </View>
        {academicMarks && typeof academicMarks === 'object' && !Array.isArray(academicMarks) ? (
          Object.entries(academicMarks).map(([semester, marks]) => (
            <View key={semester} style={styles.row}>
              <Text style={styles.academicCell}>
                Semester {semester.replace(/sem/i, '')}
              </Text>
              <Text style={styles.academicCell}>{marks.cgpa || 'N/A'}</Text>
              <Text style={styles.academicCell}>{marks.ogpa || 'N/A'}</Text>
              <Text style={styles.academicCell}>{marks.percentage || 'N/A'}</Text>
            </View>
          ))
        ) : (
          <View style={styles.row}>
            <Text style={styles.academicCell}>No Academic Records</Text>
            <Text style={styles.academicCell}>N/A</Text>
            <Text style={styles.academicCell}>N/A</Text>
            <Text style={styles.academicCell}>N/A</Text>
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