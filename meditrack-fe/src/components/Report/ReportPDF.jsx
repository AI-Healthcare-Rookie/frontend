import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 24 },
  h1: { fontSize: 18, marginBottom: 8 },
  section: { marginTop: 12 },
  item: { fontSize: 11, marginBottom: 4 }
});

/** data: 서버 분석결과(JSON) */
export default function ReportPDF({ data, range }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>약 복용 분석 리포트</Text>
        <Text>기간: {range.from} ~ {range.to}</Text>
        <View style={styles.section}>
          <Text>요약</Text>
          <Text style={styles.item}>총 방문: {data.summary.totalVisits}</Text>
          <Text style={styles.item}>중복/주의 약물: {data.summary.riskyCombos}</Text>
        </View>
        <View style={styles.section}>
          <Text>세부 내역</Text>
          {data.details.map((row,idx)=>(
            <Text key={idx} style={styles.item}>
              {row.date} — {row.hospital} — {row.medicine} — {row.note}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
