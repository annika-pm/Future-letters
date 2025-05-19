import { Tabs } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Image } from 'react-native'; 
export default function TabLayout() { 
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen 
        name="index"
        options={{ 
          title: 'Home',   
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
        }}
      /> 
      
     <Tabs.Screen
        name="capsules" 
        options={{
          title: 'Capsules',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="paperplane" color={color} />,
        }}
      />
       
    </Tabs>
  );
}
