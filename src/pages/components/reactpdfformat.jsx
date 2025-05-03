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
 // Ensure you have this

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
  cellKey: {
    width: '40%',
    fontWeight: 'bold',
    paddingRight: 8,
  },
  cellValue: {
    width: '60%',
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

const InfoPDF = ({ Info }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Image src="/images/au.png" style={styles.logo} />
        <View>
          <Text style={styles.headerText}>ANNAMALAI UNIVERSITY</Text>
          <Text>DEPARTMENT OF INFORMATION TECHNOLOGY</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row',justifyContent: 'space-between',marginBottom: 10,}}>
        <Text style={{color:"green",fontWeight:"bold",textDecoration:"underline"}}>DATA SHEET</Text>
        <Text style={{fontWeight:"bold",  color: 'blue' }}>  Generated on: {getFormattedDate()}</Text>
      </View>
  
      {/* Table Content */}
      <View style={styles.table}>
        {Object.entries(Info).map(([key, value]) => (
          <View key={key} style={styles.row}>
            <Text style={styles.cellKey}>{key.replace(/([A-Z])/g, ' $1')}</Text>
            <Text style={styles.cellValue}>{value || 'N/A'}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Address: Annamalai Nagar, Chidambaram, Tamil Nadu - 608002</Text>
      </View>
    </Page>
  </Document>
);

export default InfoPDF;
