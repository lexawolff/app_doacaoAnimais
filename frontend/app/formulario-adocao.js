import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import supabase from '../lib/supabase';
import { useRouter } from 'expo-router';

// Componentes de formulário
const DadosPessoais = ({ nome, setNome, idade, setIdade, endereco, setEndereco, cidadeEstado, setCidadeEstado, telefone, setTelefone, email, setEmail }) => (
  <>
    <Text style={styles.title}>Dados do Interessado</Text>
    <Text style={styles.label}>Nome completo</Text>
    <TextInput
      style={styles.input}
      placeholder="Insira seu nome completo"
      value={nome}
      onChangeText={setNome}
    />
    <Text style={styles.label}>Idade</Text>
    <TextInput
      style={styles.input}
      placeholder="Idade"
      value={idade}
      onChangeText={setIdade}
      keyboardType="numeric"
    />
    <Text style={styles.label}>Endereço</Text>
    <TextInput
      style={styles.input}
      placeholder="R. Antonio Machado, 596"
      value={endereco}
      onChangeText={setEndereco}
    />
    <Text style={styles.label}>Cidade/Estado</Text>
    <TextInput
      style={styles.input}
      placeholder="Curitiba/PR"
      value={cidadeEstado}
      onChangeText={setCidadeEstado}
    />
    <Text style={styles.label}>Telefone</Text>
    <TextInput
      style={styles.input}
      placeholder="(41) 9 8469-8426"
      value={telefone}
      onChangeText={setTelefone}
      keyboardType="phone-pad"
    />
    <Text style={styles.label}>E-mail</Text>
    <TextInput
      style={styles.input}
      placeholder="exemplo@email.com"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
      autoCapitalize="none"
    />
  </>
);

const DadosAdocao = ({ animalDesejado, setAnimalDesejado, motivoAdocao, setMotivoAdocao, teveAnimais, setTeveAnimais, quaisAnimais, setQuaisAnimais, outrosAnimais, setOutrosAnimais, quaisOutros, setQuaisOutros }) => (
  <>
    <Text style={styles.title}>Formulário</Text>
    <Text style={styles.subtitle}>Sobre a Adoção</Text>
    <Text style={styles.label}>Qual animal deseja adotar?</Text>
    <TextInput
      style={styles.input}
      placeholder="nome/tipo"
      value={animalDesejado}
      onChangeText={setAnimalDesejado}
    />
    <Text style={styles.label}>Por que deseja adotá-lo?:</Text>
    <TextInput
      style={styles.input}
      placeholder=""
      value={motivoAdocao}
      onChangeText={setMotivoAdocao}
    />
    <Text style={styles.label}>Já teve animais antes?</Text>
    <View style={styles.checkboxRow}>
      <TouchableOpacity style={[styles.checkbox, teveAnimais === true && styles.checkboxChecked]} onPress={() => setTeveAnimais(true)}>
        {teveAnimais === true && <View style={styles.checkboxInner} />}
      </TouchableOpacity>
      <Text style={styles.checkboxLabel}>Sim</Text>
      <TouchableOpacity style={[styles.checkbox, teveAnimais === false && styles.checkboxChecked]} onPress={() => setTeveAnimais(false)}>
        {teveAnimais === false && <View style={styles.checkboxInner} />}
      </TouchableOpacity>
      <Text style={styles.checkboxLabel}>Não</Text>
    </View>
    <Text style={styles.label}>Se sim, quais e onde estão agora?</Text>
    <TextInput
      style={styles.input}
      placeholder=""
      value={quaisAnimais}
      onChangeText={setQuaisAnimais}
    />
    <Text style={styles.label}>Há outros animais na residência?</Text>
    <View style={styles.checkboxRow}>
      <TouchableOpacity style={[styles.checkbox, outrosAnimais === true && styles.checkboxChecked]} onPress={() => setOutrosAnimais(true)}>
        {outrosAnimais === true && <View style={styles.checkboxInner} />}
      </TouchableOpacity>
      <Text style={styles.checkboxLabel}>Sim</Text>
      <TouchableOpacity style={[styles.checkbox, outrosAnimais === false && styles.checkboxChecked]} onPress={() => setOutrosAnimais(false)}>
        {outrosAnimais === false && <View style={styles.checkboxInner} />}
      </TouchableOpacity>
      <Text style={styles.checkboxLabel}>Não</Text>
    </View>
    <Text style={styles.label}>Se sim, quais? Estão vacinados e castrados?</Text>
    <TextInput
      style={styles.input}
      placeholder=""
      value={quaisOutros}
      onChangeText={setQuaisOutros}
    />
  </>
);

const DadosAmbiente = ({ acessoExterno, setAcessoExterno, localSeguro, setLocalSeguro, ondeFicara, setOndeFicara, tempoSozinho, setTempoSozinho }) => (
  <>
    <Text style={styles.title}>Formulário</Text>
    <Text style={styles.subtitle}>Sobre o Ambiente</Text>
    <Text style={styles.label}>O animal terá acesso a áreas externas?</Text>
    <View style={styles.checkboxRow}>
      <TouchableOpacity style={[styles.checkbox, acessoExterno === true && styles.checkboxChecked]} onPress={() => setAcessoExterno(true)}>
        {acessoExterno === true && <View style={styles.checkboxInner} />}
      </TouchableOpacity>
      <Text style={styles.checkboxLabel}>Sim</Text>
      <TouchableOpacity style={[styles.checkbox, acessoExterno === false && styles.checkboxChecked]} onPress={() => setAcessoExterno(false)}>
        {acessoExterno === false && <View style={styles.checkboxInner} />}
      </TouchableOpacity>
      <Text style={styles.checkboxLabel}>Não</Text>
    </View>
    <Text style={styles.label}>O local é seguro e cercado?</Text>
    <View style={styles.checkboxRow}>
      <TouchableOpacity style={[styles.checkbox, localSeguro === true && styles.checkboxChecked]} onPress={() => setLocalSeguro(true)}>
        {localSeguro === true && <View style={styles.checkboxInner} />}
      </TouchableOpacity>
      <Text style={styles.checkboxLabel}>Sim</Text>
      <TouchableOpacity style={[styles.checkbox, localSeguro === false && styles.checkboxChecked]} onPress={() => setLocalSeguro(false)}>
        {localSeguro === false && <View style={styles.checkboxInner} />}
      </TouchableOpacity>
      <Text style={styles.checkboxLabel}>Não</Text>
    </View>
    <Text style={styles.label}>O animal ficará:</Text>
    <View style={styles.checkboxRow}>
      <TouchableOpacity style={[styles.checkbox, ondeFicara === 'casa' && styles.checkboxChecked]} onPress={() => setOndeFicara('casa')}>
        {ondeFicara === 'casa' && <View style={styles.checkboxInner} />}
      </TouchableOpacity>
      <Text style={styles.checkboxLabel}>Dentro de casa</Text>
      <TouchableOpacity style={[styles.checkbox, ondeFicara === 'quintal' && styles.checkboxChecked]} onPress={() => setOndeFicara('quintal')}>
        {ondeFicara === 'quintal' && <View style={styles.checkboxInner} />}
      </TouchableOpacity>
      <Text style={styles.checkboxLabel}>Quintal</Text>
      <TouchableOpacity style={[styles.checkbox, ondeFicara === 'livre' && styles.checkboxChecked]} onPress={() => setOndeFicara('livre')}>
        {ondeFicara === 'livre' && <View style={styles.checkboxInner} />}
      </TouchableOpacity>
      <Text style={styles.checkboxLabel}>Livre acesso</Text>
    </View>
    <Text style={styles.label}>Quanto tempo o animal ficará sozinho por dia?</Text>
    <TextInput
      style={styles.input}
      placeholder=""
      value={tempoSozinho}
      onChangeText={setTempoSozinho}
    />
  </>
);

const Compromissos = ({ compromisso1, setCompromisso1, compromisso2, setCompromisso2, compromisso3, setCompromisso3, compromisso4, setCompromisso4, assinatura, setAssinatura, dataAssinatura, setDataAssinatura }) => (
  <>
    <Text style={styles.title}>Formulário</Text>
    <Text style={styles.subtitle}>Compromisso</Text>

    <View style={styles.checkboxRowVertical}>
      <TouchableOpacity style={[styles.checkbox, compromisso1 && styles.checkboxChecked]} onPress={() => setCompromisso1(!compromisso1)}>
        {compromisso1 && <View style={styles.checkboxInner} />}
      </TouchableOpacity>
      <Text style={styles.checkboxLabelVertical}>Castrar o animal (caso ainda não esteja castrado)</Text>
    </View>
    <View style={styles.checkboxRowVertical}>
      <TouchableOpacity style={[styles.checkbox, compromisso2 && styles.checkboxChecked]} onPress={() => setCompromisso2(!compromisso2)}>
        {compromisso2 && <View style={styles.checkboxInner} />}
      </TouchableOpacity>
      <Text style={styles.checkboxLabelVertical}>Fornecer alimentação adequada, abrigo, carinho e cuidados veterinários</Text>
    </View>
    <View style={styles.checkboxRowVertical}>
      <TouchableOpacity style={[styles.checkbox, compromisso3 && styles.checkboxChecked]} onPress={() => setCompromisso3(!compromisso3)}>
        {compromisso3 && <View style={styles.checkboxInner} />}
      </TouchableOpacity>
      <Text style={styles.checkboxLabelVertical}>Não repassar o animal a terceiros sem contato com a ONG/ responsável</Text>
    </View>
    <View style={styles.checkboxRowVertical}>
      <TouchableOpacity style={[styles.checkbox, compromisso4 && styles.checkboxChecked]} onPress={() => setCompromisso4(!compromisso4)}>
        {compromisso4 && <View style={styles.checkboxInner} />}
      </TouchableOpacity>
      <Text style={styles.checkboxLabelVertical}>Avisar em caso de mudança de endereço ou problemas</Text>
    </View>

    <Text style={[styles.label, { marginTop: 18 }]}>Assinatura do adotante: <Text style={{ borderBottomWidth: 1, borderColor: '#bbb' }}>{assinatura || '_________________________'}</Text></Text>
    <Text style={styles.label}>Data: <Text style={{ borderBottomWidth: 1, borderColor: '#bbb' }}>{dataAssinatura || '__ / __ / ____'}</Text></Text>
    <TextInput
      style={[styles.input, { marginTop: 0 }]}
      placeholder="Digite seu nome para assinatura"
      value={assinatura}
      onChangeText={setAssinatura}
    />
    <TextInput
      style={styles.input}
      placeholder="Data (ex: 01/01/2024)"
      value={dataAssinatura}
      onChangeText={setDataAssinatura}
    />
  </>
);

export default function FormularioAdocao() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Primeira etapa
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidadeEstado, setCidadeEstado] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  // Segunda etapa
  const [etapa, setEtapa] = useState(1);
  const [animalDesejado, setAnimalDesejado] = useState('');
  const [motivoAdocao, setMotivoAdocao] = useState('');
  const [teveAnimais, setTeveAnimais] = useState(null);
  const [quaisAnimais, setQuaisAnimais] = useState('');
  const [outrosAnimais, setOutrosAnimais] = useState(null);
  const [quaisOutros, setQuaisOutros] = useState('');

  // Terceira etapa
  const [acessoExterno, setAcessoExterno] = useState(null);
  const [localSeguro, setLocalSeguro] = useState(null);
  const [ondeFicara, setOndeFicara] = useState('');
  const [tempoSozinho, setTempoSozinho] = useState('');

  // Quarta etapa - Compromisso
  const [compromisso1, setCompromisso1] = useState(false);
  const [compromisso2, setCompromisso2] = useState(false);
  const [compromisso3, setCompromisso3] = useState(false);
  const [compromisso4, setCompromisso4] = useState(false);
  const [assinatura, setAssinatura] = useState('');
  const [dataAssinatura, setDataAssinatura] = useState('');

  const validarEtapa1 = () => {
    if (!nome || !idade || !endereco || !cidadeEstado || !telefone || !email) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return false;
    }
    return true;
  };

  const validarEtapa2 = () => {
    if (!animalDesejado || !motivoAdocao || teveAnimais === null || outrosAnimais === null) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return false;
    }
    return true;
  };

  const validarEtapa3 = () => {
    if (acessoExterno === null || localSeguro === null || !ondeFicara || !tempoSozinho) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return false;
    }
    return true;
  };

  const validarEtapa4 = () => {
    if (!compromisso1 || !compromisso2 || !compromisso3 || !compromisso4 || !assinatura || !dataAssinatura) {
      Alert.alert('Erro', 'Preencha todos os compromissos, assinatura e data.');
      return false;
    }
    return true;
  };

  const handleSalvar = async () => {
    if (etapa === 1 && !validarEtapa1()) return;
    if (etapa === 2 && !validarEtapa2()) return;
    if (etapa === 3 && !validarEtapa3()) return;
    if (etapa === 4 && !validarEtapa4()) return;

    if (etapa < 4) {
      setEtapa(etapa + 1);
      return;
    }

    try {
      setLoading(true);
      const user = supabase.auth.user();
      
      if (!user) {
        Alert.alert('Erro', 'Você precisa estar logado para enviar o formulário.');
        return;
      }

      const { error } = await supabase
        .from('formularios_adocao')
        .insert([
          {
            user_id: user.id,
            // Dados pessoais
            nome,
            idade,
            endereco,
            cidade_estado: cidadeEstado,
            telefone,
            email,
            // Dados da adoção
            animal_desejado: animalDesejado,
            motivo_adocao: motivoAdocao,
            teve_animais: teveAnimais,
            quais_animais: quaisAnimais,
            outros_animais: outrosAnimais,
            quais_outros: quaisOutros,
            // Dados do ambiente
            acesso_externo: acessoExterno,
            local_seguro: localSeguro,
            onde_ficara: ondeFicara,
            tempo_sozinho: tempoSozinho,
            // Compromissos
            compromisso_castracao: compromisso1,
            compromisso_cuidados: compromisso2,
            compromisso_repassagem: compromisso3,
            compromisso_mudanca: compromisso4,
            assinatura,
            data_assinatura: dataAssinatura,
            status: 'Pendente',
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      Alert.alert(
        'Sucesso!',
        'Formulário enviado com sucesso! Entraremos em contato em breve.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/')
          }
        ]
      );
    } catch (error) {
      console.error('Erro ao salvar formulário:', error);
      Alert.alert('Erro', 'Não foi possível enviar o formulário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {etapa === 1 && (
        <DadosPessoais
          nome={nome}
          setNome={setNome}
          idade={idade}
          setIdade={setIdade}
          endereco={endereco}
          setEndereco={setEndereco}
          cidadeEstado={cidadeEstado}
          setCidadeEstado={setCidadeEstado}
          telefone={telefone}
          setTelefone={setTelefone}
          email={email}
          setEmail={setEmail}
        />
      )}
      {etapa === 2 && (
        <DadosAdocao
          animalDesejado={animalDesejado}
          setAnimalDesejado={setAnimalDesejado}
          motivoAdocao={motivoAdocao}
          setMotivoAdocao={setMotivoAdocao}
          teveAnimais={teveAnimais}
          setTeveAnimais={setTeveAnimais}
          quaisAnimais={quaisAnimais}
          setQuaisAnimais={setQuaisAnimais}
          outrosAnimais={outrosAnimais}
          setOutrosAnimais={setOutrosAnimais}
          quaisOutros={quaisOutros}
          setQuaisOutros={setQuaisOutros}
        />
      )}
      {etapa === 3 && (
        <DadosAmbiente
          acessoExterno={acessoExterno}
          setAcessoExterno={setAcessoExterno}
          localSeguro={localSeguro}
          setLocalSeguro={setLocalSeguro}
          ondeFicara={ondeFicara}
          setOndeFicara={setOndeFicara}
          tempoSozinho={tempoSozinho}
          setTempoSozinho={setTempoSozinho}
        />
      )}
      {etapa === 4 && (
        <Compromissos
          compromisso1={compromisso1}
          setCompromisso1={setCompromisso1}
          compromisso2={compromisso2}
          setCompromisso2={setCompromisso2}
          compromisso3={compromisso3}
          setCompromisso3={setCompromisso3}
          compromisso4={compromisso4}
          setCompromisso4={setCompromisso4}
          assinatura={assinatura}
          setAssinatura={setAssinatura}
          dataAssinatura={dataAssinatura}
          setDataAssinatura={setDataAssinatura}
        />
      )}

      {/* Indicador de progresso */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressDot, etapa === 1 && styles.progressDotActive]} />
        <View style={[styles.progressDot, etapa === 2 && styles.progressDotActive]} />
        <View style={[styles.progressDot, etapa === 3 && styles.progressDotActive]} />
        <View style={[styles.progressDot, etapa === 4 && styles.progressDotActive]} />
      </View>

      {/* Botão SALVAR ou PRÓXIMO */}
      <TouchableOpacity 
        style={[styles.btnSalvar, loading && styles.btnDisabled]} 
        onPress={handleSalvar}
        disabled={loading}
      >
        <LinearGradient
          colors={['#ffba00', '#ff7b00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnSalvarText}>{etapa < 4 ? 'PRÓXIMO' : 'SALVAR'}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 10,
    color: '#222',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#eee',
    fontSize: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 24,
    gap: 8,
  },
  progressDot: {
    width: 28,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#eee',
    marginHorizontal: 3,
  },
  progressDotActive: {
    backgroundColor: '#ffba00',
    width: 32,
  },
  btnSalvar: {
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 8,
  },
  gradient: {
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnSalvarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: '#bbb',
    borderRadius: 6,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    borderColor: '#ffba00',
  },
  checkboxInner: {
    width: 16,
    height: 16,
    backgroundColor: '#ffba00',
    borderRadius: 4,
  },
  checkboxLabel: {
    marginRight: 16,
    fontSize: 16,
    color: '#222',
  },
  checkboxRowVertical: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  checkboxLabelVertical: {
    flex: 1,
    fontSize: 15,
    color: '#222',
    marginLeft: 10,
    marginTop: 2,
  },
  btnDisabled: {
    opacity: 0.7
  }
});