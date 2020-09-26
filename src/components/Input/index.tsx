// useImperativeHandle -> passa informações de um componente filho para um componente pai
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { TextInputProps } from 'react-native';
import { useField } from '@unform/core';

import { Container, TextInput, Icon } from './styles';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
  containerStyle?: {};
}

interface InputValueReference {
  value: string;
}

interface InputRef {
  focus(): void;
}
// ...rest está pegando o resto das propriedades , inclusive placeholder
// keyboardAppearance funciona apenas no ios
// RefForwardingComponent -> componente que aceita receber uma ref (FC não aceita receber ref)
const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  { name, icon, containerStyle = {}, ...rest },
  ref,
) => {
  const inputElementRef = useRef<any>(null);

  const { registerField, defaultValue = '', fieldName, error } = useField(name);
  const inputValueRef = useRef<InputValueReference>({ value: defaultValue });

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    // se o input estiver preenchido será true, senão será false
    setIsFilled(!!inputValueRef.current.value);
  }, []);
  useImperativeHandle(ref, () => ({
    // cria o método focus
    focus() {
      inputElementRef.current.focus();
    },
  }));

  // assim que o elemento for exibido em tela, ele será registrado no Unform
  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value', // onde busca o valor de input (dentro da propriedade value)
      setValue(ref: any, value) {
        inputValueRef.current.value = value;
        inputElementRef.current.setNativeProps({ text: value }); // muda visualmente o texto que está dentro do input
      },
      // o que vai acontecer com o input quando o unform precisar limpá-lo
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current.clear();
      },
    });
  }, [fieldName, registerField]);
  return (
    <Container style={containerStyle} isFocused={isFocused} isErrored={!!error}>
      <Icon
        name={icon}
        size={20}
        color={isFocused || isFilled ? '#ff9000' : '#666360'}
      />
      <TextInput
        ref={inputElementRef}
        keyboardAppearance="dark"
        placeholderTextColor="#666360"
        defaultValue={defaultValue}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onChangeText={value => {
          inputValueRef.current.value = value;
        }}
        {...rest}
      />
    </Container>
  );
};
// forwardRef é necessário porque foi criado um componente que recebe a ref
export default forwardRef(Input);
