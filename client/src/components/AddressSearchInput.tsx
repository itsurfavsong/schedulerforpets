import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useAddressSearch } from '../hooks/useAddressSearch';

interface Props {
  value: string;
  onChange: (address: string) => void;
}

export default function AddressSearchInput({ value, onChange }: Props) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { results, isSearching, searchAddress, clearResults } = useAddressSearch();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsOpen(true);
    await searchAddress(query);
  };

  const handleSelect = (address: string) => {
    onChange(address);
    setQuery('');
    setIsOpen(false);
    clearResults();
  };

  return (
    <View>
      {/* 현재 선택된 주소 */}
      {value ? (
        <View style={styles.selectedAddress}>
          <Text style={styles.selectedAddressText}>📍 {value}</Text>
          <TouchableOpacity onPress={() => onChange('')}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* 검색 입력창 */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="주소 검색..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
        >
          {isSearching ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.searchButtonText}>검색</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* 검색 결과 */}
      {isOpen && results.length > 0 ? (
        <View style={styles.resultList}>
          <FlatList
            data={results}
            keyExtractor={(item) => item.address_name}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleSelect(
                  item.road_address_name || item.address_name
                )}
              >
                <Text style={styles.roadAddress}>
                  📍 {item.road_address_name || item.address_name}
                </Text>
                {item.road_address_name && (
                  <Text style={styles.jibunAddress}>
                    지번 {item.address_name}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      ) : null}

      {/* 결과 없음 */}
      {isOpen && !isSearching && results.length === 0 ? (
        <View style={styles.noResult}>
          <Text style={styles.noResultText}>검색 결과가 없습니다.</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  selectedAddress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  selectedAddressText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  clearText: {
    fontSize: 16,
    color: '#999',
    paddingLeft: 8,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  resultList: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    marginTop: 4,
    overflow: 'hidden',
  },
  resultItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 4,
  },
  roadAddress: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  jibunAddress: {
    fontSize: 12,
    color: '#999',
  },
  noResult: {
    padding: 14,
    alignItems: 'center',
  },
  noResultText: {
    fontSize: 14,
    color: '#999',
  },
});