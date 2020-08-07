import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';

import styles from './styles';
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isFiltersVisible, setIsFilterVisible] = useState(false);

  const [subject, setSubject] = useState('');
  const [week_day, setWeekDay] = useState('');
  const [time, setTime] = useState('');

  async function getFavorites() {
    const response = await AsyncStorage.getItem('favorites');
    
    if (response) {
      const favoritedTeachers = JSON.parse(response);
      const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
        return teacher.id;
      });

      setFavorites(favoritedTeachersIds);
    }
  }

  useFocusEffect(() => {
    getFavorites();
  });

  function handleToggleFiltersVisible() {
    setIsFilterVisible(!isFiltersVisible);
  }

  async function handleFiltersSubmit() {
    getFavorites();

    const response = await api.get('classes', {
      params: {
        subject,
        week_day,
        time,
      }
    });

    setIsFilterVisible(false);
    setTeachers(response.data);
  }

  return (
    <View  style={styles.container}>
      <PageHeader 
        title="Proffys disponíveis" 
        headerRight={(
          <BorderlessButton onPress={handleToggleFiltersVisible}>
            <Feather name="filter" size={20} color="#FFF" />
          </BorderlessButton>
        )}
      >
        { isFiltersVisible && (
          <View style={styles.searchForm}>
            <Text style={styles.label}>Matéria</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Qual a matéria?" 
              placeholderTextColor="#C1BCCC"
              value={subject}
              onChangeText={setSubject}
            />

            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Dia da seamana</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Qual o dia?" 
                  placeholderTextColor="#C1BCCC"
                  value={week_day}
                  onChangeText={setWeekDay}
                />
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.label}>Horário</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Qual horário?" 
                  placeholderTextColor="#C1BCCC"
                  value={time}
                  onChangeText={setTime}
                />
              </View>
            </View>

            <RectButton 
              style={styles.submitButton} 
              onPress={handleFiltersSubmit}
            >
              <Text style={styles.submitButtonText}>Filtrar</Text>
            </RectButton>
          </View>
        ) }
      </PageHeader>

      <ScrollView 
        style={styles.teacherList}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
      >
        {teachers.map((teacher: Teacher) => {
          return (
            <TeacherItem 
              key={String(teacher.id)} 
              teacher={teacher} 
              favorited={favorites.includes(teacher.id)}
            />
          )
        })}
      </ScrollView>
    </View>
  );
}

export default TeacherList;