export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Landing: undefined;
};

export type CustomerStackParamList = {
  CustomerHome: undefined;
  GroomerList: undefined;
  GroomerDetail: { groomerId: string; groomerName: string };
  ReservationConfirm: {
    groomerId: string;
    groomerName: string;
    date: string;
    startTime: string;
    endTime: string;
  };
  PetManage: undefined; 
  PetForm: { petId?: string; petName?: string }; 
  ReviewForm: {                    
    groomerId: string;
    groomerName: string;
    reservationId: string;
    reviewId?: string;              
    existingRating?: number;
    existingComment?: string;
  };
  ChatList: undefined;
  Chat: { roomId: string; shopName: string };
};

export type GroomerStackParamList = {
  GroomerHome: undefined;
  GroomerReservationDetail: { reservationId: string };
  GroomerProfile: undefined;
  ChatList: undefined;
  Chat: { roomId: string; shopName: string };
};

export type RootStackParamList = AuthStackParamList & CustomerStackParamList & GroomerStackParamList;