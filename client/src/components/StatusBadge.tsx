import { Text, StyleSheet } from 'react-native';

type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'done';

const StatusBadge = ({ status }: { status: ReservationStatus }) => {
  const { label, style, textStyle } = STATUS_MAP[status];
  return <Text style={[styles.base, style, textStyle]}>{label}</Text>;
};

export default StatusBadge;

const styles = StyleSheet.create({
  base: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
  },
  pending: { backgroundColor: '#FFE0E0' },
  pendingText: { color: '#FF6B6B' },
  confirmed: { backgroundColor: '#E0F5E0' },
  confirmedText: { color: '#4CAF50' },
  cancelled: { backgroundColor: '#EEE' },
  cancelledText: { color: '#999' },
  done: { backgroundColor: '#E0E8FF' },
  doneText: { color: '#5B8CFF' },
});

const STATUS_MAP: Record<ReservationStatus, { label: string; style: object; textStyle: object }> = {
  pending: {
    label: '대기중',
    style: styles.pending,
    textStyle: styles.pendingText,
  },
  confirmed: {
    label: '확정',
    style: styles.confirmed,
    textStyle: styles.confirmedText,
  },
  cancelled: {
    label: '취소',
    style: styles.cancelled,
    textStyle: styles.cancelledText,
  },
  done: {
    label: '완료',
    style: styles.done,
    textStyle: styles.doneText,
  },
};