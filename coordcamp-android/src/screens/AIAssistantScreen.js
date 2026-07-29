import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList, ActivityIndicator, ScrollView } from 'react-native';

export default function AIAssistantScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', text: "Hello Anna! I'm your CoordCamp AI Assistant. How can I help you today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Missing Gemini API Key. Please add EXPO_PUBLIC_GEMINI_API_KEY to your .env file and restart the app.");
      }

      const history = messages
        .filter(msg => msg.id !== '1') // Skip the static welcome message if you want, or map it to model. Let's map it.
        .map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));
      
      // Map the first welcome message explicitly as model
      const contents = [
        { role: 'model', parts: [{ text: "Hello Anna! I'm your CoordCamp AI Assistant. How can I help you today?" }] },
        ...history,
        { role: 'user', parts: [{ text: input }] }
      ];

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            role: 'system',
            parts: [{ text: "You are the CoordCamp AI Assistant. You help university students, club leaders, and admins manage their campus life, events, and clubs. Keep your answers concise, helpful, and friendly." }]
          }
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to connect to AI server');
      }

      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that request.";

      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        text: aiText 
      }]);

    } catch (error) {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        text: `⚠️ ${error.message}` 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageWrapper, isUser ? styles.messageWrapperUser : styles.messageWrapperAI]}>
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Text style={{ fontSize: 16 }}>🤖</Text>
          </View>
        )}
        <View style={[styles.messageBubble, isUser ? styles.messageBubbleUser : styles.messageBubbleAI]}>
          <Text style={[styles.messageText, isUser ? styles.messageTextUser : styles.messageTextAI]}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={{ fontSize: 20 }}>🤖</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>CoordCamp AI Assistant</Text>
          <Text style={styles.headerSubtitle}>Powered by Gemini</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={
          isTyping && (
            <View style={[styles.messageWrapper, styles.messageWrapperAI]}>
              <View style={styles.aiAvatar}>
                <Text style={{ fontSize: 16 }}>🤖</Text>
              </View>
              <View style={[styles.messageBubble, styles.messageBubbleAI, { padding: 12 }]}>
                <ActivityIndicator size="small" color="#6B7280" />
              </View>
            </View>
          )
        }
      />

      <View style={styles.inputContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestions}>
          {['Attendance Help', 'Event Recommendations', 'Club Suggestions'].map((suggestion, index) => (
            <TouchableOpacity key={index} style={styles.suggestionBadge} onPress={() => setInput(suggestion)}>
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Ask me anything about CoordCamp..."
            placeholderTextColor="#9CA3AF"
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, (!input.trim() || isTyping) && { opacity: 0.5 }]} 
            onPress={handleSend}
            disabled={!input.trim() || isTyping}
          >
            <Text style={{ color: 'white', fontSize: 20 }}>↗</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    backgroundColor: '#2D3748', // Dark gray/navy matching the web header
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    margin: 16,
    borderRadius: 16,
  },
  headerIcon: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 12,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  messageWrapperUser: {
    alignSelf: 'flex-end',
  },
  messageWrapperAI: {
    alignSelf: 'flex-start',
  },
  aiAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  messageBubble: {
    padding: 16,
    borderRadius: 20,
  },
  messageBubbleUser: {
    backgroundColor: '#8B1A1A',
    borderBottomRightRadius: 4,
  },
  messageBubbleAI: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderTopLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  messageTextUser: {
    color: 'white',
    fontSize: 15,
    lineHeight: 22,
  },
  messageTextAI: {
    color: '#1C2E4A',
    fontSize: 15,
    lineHeight: 22,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
  },
  suggestions: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  suggestionBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  suggestionText: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    color: '#1C2E4A',
    fontSize: 15,
  },
  sendButton: {
    width: 40,
    height: 40,
    backgroundColor: '#6B7280', // Gray matching web button
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  }
});
