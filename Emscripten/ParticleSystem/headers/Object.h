#pragma once
#include "Vector.h"

class Object {

protected:

	bool _transformable;
	bool _selectable;
	Vector _position;
	Vector _offset;
    int _id;

public:

  ///////////////////////////////////////////////////////////////////
  //
  //
  ///////////////////////////////////////////////////////////////////
  Object(int id);

  ///////////////////////////////////////////////////////////////////
  //
  //
  ///////////////////////////////////////////////////////////////////
  int getId();

  ///////////////////////////////////////////////////////////////////
  //
  //
  ///////////////////////////////////////////////////////////////////
  Vector* getPosition();

  ///////////////////////////////////////////////////////////////////
  //
  //
  ///////////////////////////////////////////////////////////////////
  Vector* getOffset();
};
