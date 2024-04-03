
# Pass.In API

Desenvolvimento da api do evento NLW Unite da Rocketseat.




## Stack utilizada

**Back-end:** Node.JS, TypeScript, Fastify, PrismaORM

**Banco de dados**: SqLite3


## Documentação da API

### Cria um evento

```http
  POST /events
```

#### Corpo da requisição
```json
{
  "title": "string",
  "details": "string",
  "maximumAttendees": 1
}
```

### Resposta

#### 201 Created

```json
{
  "sucess": true,
  "eventId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

```http
  GET /events/{eventId}/attendees
```

### Pega participantes de um evento

### Parâmetros
Obrigatórios:
    
    eventId: string uuid

Opcionais:

    query: string
    pageIndex: string

### Resposta

#### 200 Ok

```json
{
  "attendees": [
    {
      "id": 0,
      "name": "string",
      "email": "user@example.com",
      "createdAt": "2024-04-03T19:52:23.692Z",
      "checkInAt": "2024-04-03T19:52:23.692Z"
    }
  ],
  "total": 0
}
```

### Pega dados de um evento

```http
  GET /events/{eventId}
```

### Parâmetros
Obrigatórios:
    
    eventId: string uuid

### Resposta

#### 200 Ok

```json
{
  "success": true,
  "event": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "title": "string",
    "slug": "string",
    "details": "string",
    "maximumAttendees": 0,
    "attendeesAmount": 0
  }
}
```

### Registra um participante

```http
  POST /events/{eventId}/attendees
```

#### Corpo da requisição
```json
{
  "name": "string",
  "email": "user@example.com"
}
```

### Parâmetros
Obrigatórios:
    
    eventId: string uuid

### Resposta

#### 201 Created

```json
{
  "success": true,
  "attendeeId": 0
}
```

### Pega o link de participação do evento

```http
  GET /attendees/{attendeeId}/badge
```

### Parâmetros
Obrigatórios:
    
    attendeeId: string uuid

### Resposta

#### 200 Ok

```json
{
  "badge": {
    "name": "string",
    "email": "string",
    "eventTitle": "string",
    "checkInURL": "string"
  }
}
```

### Check-in do participante

```http
  GET /attendees/{attendeeId}/check-in
```

### Parâmetros
Obrigatórios:
    
    attendeeId: string uuid

### Resposta

#### 201 Created

```json
{
  "message": "string"
}
```