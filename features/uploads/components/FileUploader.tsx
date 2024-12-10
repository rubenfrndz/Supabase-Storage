import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Linking, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker'; 
import { supabase } from '@core/supabase/client';

// import File from '@uploads/models/File';


const FileUploader = () => {
  const [files, setFiles] = useState<string[]>([]);
  const BASE_STORAGE_URL = 'https://gkrcnndkjkqhzxpwszsd.supabase.co/storage/v1/object/public/uploads';

  // Fetch files from Supabase storage
  const fetchFiles = async () => {
    const { data, error } = await supabase.storage.from('uploads').list();
    if (error) {
      console.error('Error fetching files:', error);
    } else {
      setFiles(data.map((file) => {
        // console.log(file); // Para depuración
        return file.name;  // Retorna el nombre del archivo
      }));      
    }
  };

  useEffect(() => {
    fetchFiles();
    console.log(`Archivos actualizadoss. Hay ${files.length} archivos en el bucket.`)
  },[])

  const openLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(`No se puede abrir la URL: ${url}`);
      }
    } catch (error) {
      console.error('Error al intentar abrir la URL:', error);
    }
  }

  // Handle file upload
  const uploadFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });

    // Check if the operation was canceled
    if (!result.canceled) {
      const { name, uri } = result.assets[0]; // `uri` and `name` are available in the success result
      const response = await fetch(uri);
      const fileBlob = await response.blob();

      const { error } = await supabase.storage.from('uploads').upload(name, fileBlob);
      if (error) {
        console.error('Error uploading file:', error);
      } else {
        console.log('File uploaded successfully!');
        fetchFiles(); // Refresh file list
      }
    } else {
      console.log('Document selection canceled');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={uploadFile}>
        <Text style={styles.buttonText}>Upload File</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Uploaded Files:</Text>
      {files.map((file, index) => (
        <Text key={index} style={styles.fileName}>
          {file}
          <TouchableOpacity
            style={styles.button}
            onPress={() => openLink(`${BASE_STORAGE_URL}/${file}`)}
          >
            <Text style={styles.buttonText}>Abrir Imagen</Text>
          </TouchableOpacity>
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20, // Ajuste de padding para mayor equilibrio visual
    paddingVertical: 20,
    backgroundColor: '#3A3A3A', // Fondo ligeramente más claro para mayor contraste
    width: '100%',
  },
  button: {
    backgroundColor: '#0056b3', // Color más oscuro para mejor contraste
    padding: 12,
    borderRadius: 8, // Bordes más redondeados para un estilo más moderno
    alignItems: 'center',
    marginBottom: 16,
    marginLeft: 8, // Espaciado más moderado
  },
  title: {
    fontSize: 26, // Tamaño ligeramente mayor
    fontWeight: 'bold',
    color: '#FFFFFF', // Asegura contraste en el fondo oscuro
    marginBottom: 20,
  },
  uploadButton: {
    padding: 14,
    backgroundColor: '#0056b3',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase', // Da más énfasis a los textos del botón
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic', // Estilo que destaca mientras se carga
  },
  fileItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#555', // Línea menos dominante
  },
  fileName: {
    color: '#EAEAEA', // Mejor contraste en fondo oscuro
    fontSize: 16,
    fontWeight: '500', // Resalta un poco más
  },
  fileUrl: {
    color: '#339af0', // Azul más suave
    fontSize: 14,
    textDecorationLine: 'underline', // Suele indicar que es un enlace
  },
});


export default FileUploader;
