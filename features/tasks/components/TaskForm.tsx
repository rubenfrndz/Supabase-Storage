import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '@core/supabase/client';
import { Task } from '@features/tasks/models/Task';

interface TaskFormProps {
  onSave: () => void; // Callback para notificar al componente padre cuando se guarde una tarea
}

const TaskForm: React.FC<TaskFormProps> = ({ onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      console.error('Por favor, completa todos los campos');
      return;
    }

    console.log('Datos del formulario:', { title, description });

    const user = await supabase.auth.getUser(); // Obtén el usuario autenticado
    const userId = user?.data.user?.id || process.env.EXPO_PUBLIC_ID_PRUEBAS;

    const { error } = await supabase
      .from('tasks')
      .insert([
        {
          title: title.trim(),
          description: description.trim(),
          user_id: userId,
        },
      ]);

    if (!error) {
      onSave();
      setTitle('');
      setDescription('');
    } else {
      console.error('Error al guardar la tarea:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva Tarea</Text>
      <TextInput
        style={styles.input}
        placeholder="Título"
        placeholderTextColor="#ccc"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Descripción"
        placeholderTextColor="#ccc"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#eef2f5', // Fondo más claro
    borderRadius: 12, // Redondeado para dar una sensación de contenedor
    shadowColor: 'rgba(0, 0, 0, 0.1)', // Sombra suave
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6, // Para Android
  },
  title: {
    fontSize: 26, // Tamaño de fuente más destacado
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 15, // Más espacio interno
    borderWidth: 1,
    borderColor: '#dcdfe6', // Tono gris claro
    borderRadius: 8, // Bordes más suaves
    fontSize: 16,
    color: '#2c3e50', // Texto más oscuro
    backgroundColor: '#ffffff',
    marginBottom: 15, // Separación uniforme
    shadowColor: 'rgba(0, 0, 0, 0.05)', // Sombra sutil para inputs
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  textarea: {
    height: 120, // Espacio adicional para textos largos
    textAlignVertical: 'top',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#2ecc71', // Verde más brillante
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18, // Más legible
    fontWeight: '600',
  },
});

export default TaskForm;