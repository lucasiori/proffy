import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';

import styles from './styles';

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  async function getFavorites() {
    const response = await AsyncStorage.getItem('favorites');
    
    if (response) {
      setFavorites(JSON.parse(response));
    }
  }

  useFocusEffect(() => {
    getFavorites();
  });
  
  return (
    <View  style={styles.container}>
      <PageHeader title="Meus proffys favoritos" />

      <ScrollView 
        style={styles.teacherList}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
      >
        {favorites.map((teacher: Teacher) => {
          return (
            <TeacherItem 
              key={String(teacher.id)} 
              teacher={teacher} 
              favorited
            />
          )
        })}
      </ScrollView>
    </View>
  );
}

export default Favorites;