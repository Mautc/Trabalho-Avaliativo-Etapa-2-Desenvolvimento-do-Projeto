# Modelo de Banco de Dados — ApiHub

## Diagrama de Classes (gerado pelo banco)

```mermaid
classDiagram
direction BT
class apiario {
   varchar(255) apiary_name
   varchar(255) city
   varchar(255) description
   double precision latitude
   double precision longitude
   varchar(255) registration_number
   varchar(255) territory_registration
   bigint user_id
   bigint id
}
class hive {
   integer box_count
   varchar(255) colony_origin
   varchar(255) frame_type
   varchar(255) name
   bigint apiary_id
   varchar(255) queen_identification_number
   bigint id
}
class queen {
   date birth_dat
   varchar(255) breed
   varchar(255) color
   varchar(255) origin
   varchar(255) identification_number
}
class users {
   varchar(255) password
   varchar(255) role
   varchar(255) username
   bigint id
}

apiario  -->  users : user_id:id
hive  -->  apiario : apiary_id:id
hive  -->  queen : queen_identification_number:identification_number
```

> Imagem do diagrama disponível em `../evidencias/db_apiario.png`

---

## Entidades e Atributos

### users
| Atributo | Tipo | Restrição |
|----------|------|-----------|
| id | bigint | PK |
| username | varchar(255) | NOT NULL |
| password | varchar(255) | NOT NULL (hash bcrypt) |
| role | varchar(255) | NOT NULL |

---

### apiario
| Atributo | Tipo | Restrição |
|----------|------|-----------|
| id | bigint | PK |
| apiary_name | varchar(255) | NOT NULL |
| city | varchar(255) | NOT NULL |
| description | varchar(255) | NULL |
| latitude | double precision | NOT NULL |
| longitude | double precision | NOT NULL |
| registration_number | varchar(255) | NOT NULL |
| territory_registration | varchar(255) | NOT NULL |
| user_id | bigint | FK → users(id) |

---

### hive
| Atributo | Tipo | Restrição |
|----------|------|-----------|
| id | bigint | PK |
| name | varchar(255) | NOT NULL |
| frame_type | varchar(255) | NOT NULL |
| colony_origin | varchar(255) | NOT NULL |
| box_count | integer | NOT NULL |
| apiary_id | bigint | FK → apiario(id) |
| queen_identification_number | varchar(255) | FK → queen(identification_number) |

---

### queen
| Atributo | Tipo | Restrição |
|----------|------|-----------|
| identification_number | varchar(255) | PK |
| breed | varchar(255) | NOT NULL |
| color | varchar(255) | NOT NULL |
| origin | varchar(255) | NOT NULL |
| birth_dat | date | NOT NULL |

---

## Relacionamentos

| Relacionamento | Tipo | Descrição |
|----------------|------|-----------|
| users → apiario | 1:N | Um usuário pode ter vários apiários |
| apiario → hive | 1:N | Um apiário pode ter várias colmeias |
| hive → queen | N:1 | Cada colmeia referencia uma rainha pela identificação |

## Chaves

- **Chaves Primárias (PK)**: `id` em users, apiario e hive; `identification_number` em queen
- **Chaves Estrangeiras (FK)**:
  - `apiario.user_id` → `users(id)`
  - `hive.apiary_id` → `apiario(id)`
  - `hive.queen_identification_number` → `queen(identification_number)`
