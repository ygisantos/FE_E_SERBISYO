import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register Times New Roman font
Font.register({
  family: 'Times-Roman',
  src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/times-new-roman@1.0.4/Times New Roman.ttf'
});

Font.register({
  family: 'Times-Bold',
  src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/times-new-roman-bold@1.0.4/Times New Roman Bold.ttf'
});

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: '2.54cm',
    backgroundColor: '#ffffff',
    fontFamily: 'Times-Roman'
  },
  header: {
    marginBottom: 30,
    textAlign: 'center'
  },
  headerText: {
    fontSize: 12,
    marginBottom: 3,
    fontFamily: 'Times-Roman'
  },
  headerTextBold: {
    fontSize: 14,
    marginBottom: 3,
    fontFamily: 'Times-Bold'
  },
  title: {
    fontSize: 18,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 35,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  content: {
    fontSize: 12,
    lineHeight: 1.5,
    textAlign: 'justify',
    marginBottom: 30
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10
  },
  label: {
    width: 120,
    fontSize: 12
  },
  value: {
    flex: 1,
    fontSize: 12,
    borderBottom: '1px solid black',
    paddingBottom: 2
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 50,
    right: 50
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 50
  },
  signatureBox: {
    width: 200,
    textAlign: 'center'
  },
  signatureLine: {
    borderTop: '1px solid black',
    marginTop: 40,
    marginBottom: 5
  },
  signatureText: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    alignSelf: 'center'
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: 0.1,
    width: 300,
    height: 300
  }
});

const CertificateTemplate = ({ type = 'clearance', data }) => {
  const templates = {
    clearance: (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Watermark */}
          <Image 
            src={data?.logoUrl || '/src/assets/logo/santol_logo.png'} 
            style={styles.watermark} 
          />

          {/* Header */}
          <View style={styles.header}>
            <Image 
              src={data?.logoUrl || '/src/assets/logo/santol_logo.png'} 
              style={styles.logo} 
            />
            <Text style={styles.headerText}>Republic of the Philippines</Text>
            <Text style={styles.headerText}>Province of La Union</Text>
            <Text style={styles.headerText}>Municipality of Santol</Text>
            <Text style={styles.headerText}>Barangay {data?.barangay || '_____________'}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>BARANGAY CLEARANCE</Text>

          {/* Content */}
          <View style={styles.content}>
            <Text>TO WHOM IT MAY CONCERN:</Text>
            
            <Text style={{ marginTop: 20 }}>
              This is to certify that {data?.first_name || '_________'} {data?.last_name || '_________'}, 
              {data?.age || '__'} years old, {data?.civil_status || '________'}, 
              {data?.nationality || 'Filipino'} citizen is a bonafide resident of 
              {data?.house_no || '___'} {data?.street || '_______'}, 
              Barangay {data?.barangay || '_______'}, Santol, La Union.
            </Text>

            <Text style={{ marginTop: 20 }}>
              Based on records of this office, he/she has no derogatory record filed against him/her.
            </Text>

            <Text style={{ marginTop: 20 }}>
              This certification is being issued upon the request of the above-named person for 
              {data?.purpose || '___________________'} purposes.
            </Text>

            <Text style={{ marginTop: 20 }}>
              Issued this {new Date().getDate()}th day of {new Date().toLocaleString('default', { month: 'long' })}, {new Date().getFullYear()} 
              at Barangay {data?.barangay || '_______'}, Santol, La Union.
            </Text>
          </View>

          {/* Footer/Signature */}
          <View style={styles.footer}>
            <View style={styles.signatureRow}>
              <View style={styles.signatureBox}>
                <Text style={styles.signatureLine}></Text>
                <Text style={styles.signatureText}>{data?.barangay_captain || 'BARANGAY CAPTAIN'}</Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    ),
    indigency: (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Similar structure but with Indigency specific content */}
          {/* ... */}
        </Page>
      </Document>
    ),
    business: (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Similar structure but with Business Permit specific content */}
          {/* ... */}
        </Page>
      </Document>
    )
  };

  return templates[type] || templates.clearance;
};

export default CertificateTemplate;