import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import axiosInstance from '../api/axiosInstance';
import { type ReactNativeFile } from '../types';

export const useImageUpload = () => {
  const pickAndUpload = async (
    uploadUrl: string,
    onSuccess: (url: string) => void,
  ) => {
    // 권한 요청
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('갤러리 접근 권한이 필요합니다.');
        return;
      }
    }

    // 이미지 선택
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    const formData = new FormData();

    if (Platform.OS === 'web') {
      const fetchResponse = await fetch(asset.uri);
      const blob = await fetchResponse.blob();
      const webFile = new File([blob], asset.fileName ?? 'upload.jpg', {
        type: asset.mimeType ?? 'image/jpeg',
      });
      formData.append('image', webFile);
    } else {
      const file: ReactNativeFile = {
        uri: asset.uri,
        type: asset.mimeType ?? 'image/jpeg',
        name: asset.fileName ?? 'upload.jpg',
      };
      formData.append('image', file as unknown as Blob);
    }

    const response = await axiosInstance.post<{ avatarUrl: string }>(
      uploadUrl,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );

    onSuccess(response.data.avatarUrl);
  };

  return { pickAndUpload };
};