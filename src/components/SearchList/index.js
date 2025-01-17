import {Container, Name} from './styles';
import {useNavigation} from '@react-navigation/native';

export function SearchList({data}) {
  const navigation = useNavigation();
  return (
    <Container
      onPress={() =>
        navigation.navigate('PostsUser', {title: data.nome, userId: data.id})
      }>
      <Name>{data.nome}</Name>
    </Container>
  );
}
