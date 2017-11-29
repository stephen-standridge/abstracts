
class ViewMatrix extends Matrix4x4 {
	// /// \name View matrix make*
	// /// \{
	// /// These functions are based on some OpenGL matrix functions used for
	// /// perspective settings. See the OpenGL docs of the related function
	// /// for further details.

	// /// \brief Matrix becomes an orthographic projection matrix.
	// ///
	// /// Related to: glOrtho. The orthographic projection has a box-shaped
	// /// viewing volume described by the six parameters. Left, right, bottom,
	// /// and top specify coordinates in the zNear clipping plane where the
	// /// corresponding box sides intersect it.
	// void makeOrthoMatrix(double left,   double right,
	//                double bottom, double top,
	//                double zNear,  double zFar);

	// /// \brief Matrix becomes a 2D orthographic projection matrix.
	// ///
	// /// Related to: glOrtho2D. The box-shaped viewing volume is
	// /// described by the four parameters and, implicitly, a zNear of -1
	// /// and a zFar of 1.
	// void makeOrtho2DMatrix(double left,   double right,
	//                         double bottom, double top);

	// /// \brief Matrix becomes a perspective projection matrix.
	// ///
	// /// Related to: glFrustum. The viewing volume is frustum-shaped and
	// /// defined by the six parameters. Left, right, top, and bottom specify
	// /// coordinates in the zNear clipping plane where the frustum edges intersect
	// /// it, and the zNear and zFar parameters define the forward distances of
	// /// the view volume. The resulting volume can be vertically and
	// /// horizontally asymmetrical around the center of the near plane.
	// void makeFrustumMatrix(double left,   double right,
	//                  double bottom, double top,
	//                  double zNear,  double zFar);

	// /// \brief Matrix becomes a perspective projection matrix.
	// ///
	// /// Related to: gluPerspective. The viewing volume is frustum-shaped amd
	// /// defined by the four parameters. The fovy and aspect ratio
	// /// are used to compute the positions of the left, right, top, and bottom sides
	// /// of the viewing volume in the zNear plane. The fovy is the y field-of-view,
	// /// the angle made by the top and bottom sides of frustum if they were to
	// /// intersect. The aspect ratio is the width of the frustum divided by its
	// /// height. Note that the resulting volume is both vertically and
	// /// horizontally symmetrical around the center of the near plane.
	// void makePerspectiveMatrix(double fovy,  double aspectRatio,
	// 					 double zNear, double zFar);

	// /// \brief Matrix becomes a combination of translation and rotation.
	// ///
	// /// Matrix becomes a combination of a translation to the position of 'eye'
	// /// and a rotation matrix which orients an object to point towards 'center'
	// /// along its z-axis. Use this function if you want an object to look at a
	// /// point from another point in space.
	// ///
	// /// \param eye The position of the object.
	// /// \param center The point which the object is "looking" at.
	// /// \param up The direction which the object considers to be "up".
	// void makeLookAtMatrix(const ofVec3f& eye, const ofVec3f& center, const ofVec3f& up);

	// /// \brief Matrix becomes a combination of an inverse translation and rotation.
	// ///
	// /// Related to: gluLookAt. This creates the inverse of makeLookAtMatrix.
	// /// The matrix will be an opposite translation from the 'eye' position,
	// /// and it will rotate things in the opposite direction of the eye-to-center
	// /// orientation. This is definitely confusing, but the main reason to use
	// /// this transform is to set up a view matrix for a camera that's looking
	// /// at a certain point. To achieve the effect of moving the camera somewhere
	// /// and rotating it so that it points at something, the rest of the world
	// /// is moved in the *opposite* direction and rotated in the *opposite* way
	// /// around the camera. This way, you get the same effect as moving the actual
	// /// camera, but all the projection math can still be done with the camera
	// /// positioned at the origin (which makes it way simpler).
	// void makeLookAtViewMatrix(const ofVec3f& eye, const ofVec3f& center, const ofVec3f& up);
	/// \name Static new* matrix functions
	/// \{
	///
	/// These are static utility functions to create new matrices. These
	/// functions generally return the equivalent of declaring a matrix and
	/// calling the corresponding "make..." function on it.
	/// \sa makeRotationMatrix

	// /// These functions create new matrices related to glFunctions. See
	// /// the description of the corresponding make* methods for more info.

	// /// \sa makeOrthoMatrix
	// inline static ofMatrix4x4 newOrthoMatrix(double left,   double right,
	//                                  double bottom, double top,
	//                                  double zNear,  double zFar);

	// /// \sa makeOrtho2DMatrix
	// inline static ofMatrix4x4 newOrtho2DMatrix(double left,   double right,
	//                                    double bottom, double top);

	// /// \sa makeFrustumMatrix
	// inline static ofMatrix4x4 newFrustumMatrix(double left,   double right,
	//                                    double bottom, double top,
	//                                    double zNear,  double zFar);

	// /// \sa makePerspectiveMatrix
	// inline static ofMatrix4x4 newPerspectiveMatrix(double fovy,  double aspectRatio,
	//                                        double zNear, double zFar);

	// /// \sa makeLookAtMatrix
	// inline static ofMatrix4x4 newLookAtMatrix(const ofVec3f& eye,
	//                                   const ofVec3f& center,
	//                                   const ofVec3f& up);
}
